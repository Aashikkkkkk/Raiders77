from typing import List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from apyori import apriori as apyori_apriori

app = FastAPI()

# Define a request model that includes an array of items for filtering
class FilterItems(BaseModel):
    items: List[str]

# Assuming the file path is 'input.csv' in the same directory as this script
file_path = 'book.csv'

def generate_association_rules(records):
    association_rules = apyori_apriori(records, min_support=0.0045, min_confidence=0.2, min_length=2)
    results = list(association_rules)
    return results

def preprocess_records(records):
    # Convert all items to string, except for NaN (will become 'nan')
    preprocessed_records = [[str(item) for item in transaction if pd.notna(item)] for transaction in records]
    return preprocessed_records


@app.post("/predict/")
async def predict(filter_items: FilterItems):
    try:
        df = pd.read_csv(file_path)
        records = df.values.tolist()
        records = preprocess_records(records)
        prediction = generate_association_rules(records)
        added_items_set = set()  # Use a set to collect unique added_items

        for item in prediction:
            ordered_statistic = item.ordered_statistics[0]
            base_items_set = set(ordered_statistic.items_base)
            # Check if all base_items are in the filter items list
            if base_items_set <= set(filter_items.items):
                added_items_set.update(ordered_statistic.items_add)  # Add to set for uniqueness
        
        # Convert the set of added_items to a list for the response
        prediction_response = list(added_items_set)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading file: {e}")
    
    return prediction_response

