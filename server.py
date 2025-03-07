from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from bayes_opt import BayesianOptimization
from bayes_opt import acquisition
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Parameter(BaseModel):
    name: str
    min: float
    max: float

class Metric(BaseModel):
    name: str

class ExperimentRow(BaseModel):
    id: int
    values: Dict[str, Any]  # Accepts mixed data types

class ExperimentData(BaseModel):
    parameters: List[Parameter]
    metrics: List[Metric]
    experiments: List[ExperimentRow]

@app.post("/process_experiments")
def process_experiments(data: ExperimentData):
    parameters = data.parameters
    metrics = data.metrics
    # Filter out experiments with empty values
    experiments = [exp for exp in data.experiments if exp.values]

    # Build parameter bounds dictionary
    pbounds = {param.name: (param.min, param.max) for param in parameters}

    # Ensure that numeric values are stored as floats
    for exp in experiments:
        exp.values = {
            k: float(v) if isinstance(v, str) and v.replace(".", "", 1).isdigit() else v
            for k, v in exp.values.items()
        }

    print("Registered experiments:", experiments)
    
    acq = acquisition.UpperConfidenceBound(kappa=2.5)

    # Initialize BayesianOptimization with a dummy objective function (f=None)
    optimizer = BayesianOptimization(
        f=None,
        acquisition_function=acq,
        pbounds=pbounds,
        random_state=1,
        allow_duplicate_points=True
    )
    optimizer.set_gp_params(alpha=1e-3, n_restarts_optimizer=5)

    metric_names = [m.name for m in metrics]

    # Register your existing experiments.
    for exp in experiments:
        # Build the parameter dictionary using keys that are in pbounds.
        param_values = {k: float(v) for k, v in exp.values.items() if k in pbounds}
        # Build a dictionary for the metric values using the provided metric names.
        metric_values = {k: float(exp.values[k]) for k in metric_names if k in exp.values}
        # Choose a target: here we use the first metric as the objective.
        if metric_values:
            target = metric_values[metric_names[0]]
        else:
            target = 0

        optimizer.register(params=param_values, target=target)
    
        # Get the next suggested parameter values.
    try:
        suggested_params = optimizer.suggest()
        # Convert suggested_params to plain Python types:
        suggested_params = {k: float(v) for k, v in suggested_params.items()}
    except Exception as e:
        return {"message": "Error during optimization", "error": str(e)}

    # Prepare plot data if we have exactly one parameter.
    plot_data = {}
    if len(pbounds) == 1:
        param_name = list(pbounds.keys())[0]
        x_min, x_max = pbounds[param_name]
        X_plot = np.linspace(x_min, x_max, 1000).reshape(-1, 1)
        gp = optimizer._gp
        y_pred, sigma = gp.predict(X_plot, return_std=True)
        # Since there's one parameter, each element of optimizer.space.params is a list.
        observed_x = [p[0] for p in optimizer.space.params]
        observed_y = list(optimizer.space.target)
        plot_data = {
            "x": X_plot.flatten().tolist(),                # Convert NumPy array to list
            "y_pred": y_pred.flatten().tolist(),
            "sigma": sigma.flatten().tolist(),
            "observed_x": [float(x) for x in observed_x],     # Ensure each is a float
            "observed_y": [float(y) for y in observed_y],
        }
    
    return {
        "message": "Next parameter values suggested",
        "next_values": suggested_params,
        "plot_data": plot_data
    }
