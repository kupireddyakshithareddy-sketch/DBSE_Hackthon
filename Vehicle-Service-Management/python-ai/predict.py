def predict_maintenance(current_km: int, last_service_km: int, interval_km: int = 5000):
    # Simple demo rule, not a trained machine-learning model.
    distance_since_service = max(0, current_km - last_service_km)
    remaining_km = max(0, interval_km - distance_since_service)
    return {
        "maintenance_due": remaining_km == 0,
        "remaining_km": remaining_km,
        "message": "Service due" if remaining_km == 0 else f"Service may be due in {remaining_km} km"
    }
