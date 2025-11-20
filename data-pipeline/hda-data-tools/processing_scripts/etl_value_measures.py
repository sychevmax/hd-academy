import pandas as pd
import os
import re
import numpy as np

def clean_band(value):
    """
    Cleans the band string but preserves the interval format.
    """
    if pd.isna(value) or value == '':
        return None
    return str(value).strip()

def parse_interval(value):
    """
    Parses a band string and returns (min, max, mid).
    """
    if pd.isna(value) or value == '':
        return np.nan, np.nan, np.nan
    
    val_str = str(value).strip().replace(',', '')
    val_str = val_str.replace('£', '')
    is_percent = '%' in val_str
    val_str = val_str.replace('%', '')
    
    min_val, max_val, mid_val = np.nan, np.nan, np.nan
    
    try:
        if '-' in val_str:
            parts = val_str.split('-')
            min_val = float(parts[0].strip())
            max_val = float(parts[1].strip())
            mid_val = (min_val + max_val) / 2
        elif '>' in val_str:
            min_val = float(val_str.replace('>', '').strip())
            mid_val = min_val # Treat as min for sorting/mid
        elif '<' in val_str:
            max_val = float(val_str.replace('<', '').strip())
            min_val = 0 # Assume 0 floor
            mid_val = max_val / 2
        else:
            # Single number
            min_val = float(val_str)
            max_val = min_val
            mid_val = min_val
            
        if is_percent:
            min_val = min_val / 100 if not pd.isna(min_val) else np.nan
            max_val = max_val / 100 if not pd.isna(max_val) else np.nan
            mid_val = mid_val / 100 if not pd.isna(mid_val) else np.nan
            
        return min_val, max_val, mid_val
    except:
        return np.nan, np.nan, np.nan

def clean_manufacturer(name):
    if pd.isna(name):
        return "Unknown"
    name = str(name).strip()
    # Basic normalization
    name = re.sub(r'\s+', ' ', name) # Remove extra spaces
    return name

def process_2022(file_path):
    print(f"Processing 2022: {file_path}")
    # Header at row 10 (0-indexed) based on inspection
    df = pd.read_excel(file_path, sheet_name='Firms', header=10)
    
    # Filter for Motor
    df = df[df['Product Category'].str.contains('Motor', case=False, na=False)]
    
    # Rename columns
    # Columns: ['Unnamed: 0', 'Firm name', 'Product Category', 'Claims acceptance rate', 'Claims frequency', 'Claims complaints as a % of claims', 'Average claims payout']
    col_map = {
        'Firm name': 'manufacturer',
        'Product Category': 'product_type',
        'Claims acceptance rate': 'acceptance_rate',
        'Claims frequency': 'claims_frequency',
        'Claims complaints as a % of claims': 'complaints_rate',
        'Average claims payout': 'avg_payout'
    }
    df = df.rename(columns=col_map)
    
    df['year'] = 2022
    return df[list(col_map.values()) + ['year']]

def process_2023(file_path):
    print(f"Processing 2023: {file_path}")
    # Header at row 10
    df = pd.read_excel(file_path, sheet_name='Firms', header=10)
    
    # Filter for Motor
    df = df[df['Product Category'].str.contains('Motor', case=False, na=False)]
    
    # Rename columns
    col_map = {
        'Firm name': 'manufacturer',
        'Product Category': 'product_type',
        'Period end date': 'year',
        'Claims acceptance rate': 'acceptance_rate',
        'Claims frequency': 'claims_frequency',
        'Claims complaints as a % of claims': 'complaints_rate',
        'Average claims payout ': 'avg_payout'
    }
    df = df.rename(columns=col_map)
    
    # Ensure year is integer
    df['year'] = pd.to_numeric(df['year'], errors='coerce').fillna(0).astype(int)
    
    return df[list(col_map.values())]

def process_2024(file_path):
    print(f"Processing 2024: {file_path}")
    # Header at row 5
    df = pd.read_excel(file_path, sheet_name='Firms', header=5)
    
    # Filter for Motor
    df = df[df['Product Category'].str.contains('Motor', case=False, na=False)]
    
    # Rename columns
    col_map = {
        'Firm Name': 'manufacturer',
        'Product Category': 'product_type',
        'Year - Period End Date': 'year',
        'Band - Claims Acceptance Rate': 'acceptance_rate',
        'Band - Claims Frequency (inc > 100%)': 'claims_frequency',
        'Band - Claims Complaints As a % Of Claims': 'complaints_rate',
        'Band - Average Claims Payout': 'avg_payout'
    }
    df = df.rename(columns=col_map)
    
    # Ensure year is integer
    df['year'] = pd.to_numeric(df['year'], errors='coerce').fillna(0).astype(int)
    
    return df[list(col_map.values())]

def main():
    all_data = []
    
    # Process 2022
    try:
        df_22 = process_2022('../data_sources/fca_gi_value_measures/gi-value-measures-data-2022.xlsx')
        all_data.append(df_22)
    except Exception as e:
        print(f"Error processing 2022: {e}")

    # Process 2023
    try:
        df_23 = process_2023('../data_sources/fca_gi_value_measures/gi-value-measures-data-2023.xlsx')
        all_data.append(df_23)
    except Exception as e:
        print(f"Error processing 2023: {e}")

    # Process 2024
    try:
        df_24 = process_2024('../data_sources/fca_gi_value_measures/gi-value-measures-data-2024.xlsx')
        all_data.append(df_24)
    except Exception as e:
        print(f"Error processing 2024: {e}")
        
    if not all_data:
        print("No data processed!")
        return

    final_df = pd.concat(all_data, ignore_index=True)
    
    # Clean and Parse
    print("Cleaning data...")
    final_df['manufacturer'] = final_df['manufacturer'].apply(clean_manufacturer)
    
    # Parse metrics
    metrics = ['acceptance_rate', 'claims_frequency', 'complaints_rate', 'avg_payout']
    for metric in metrics:
        # Clean original column
        final_df[metric] = final_df[metric].apply(clean_band)
        
        # Generate numeric columns
        parsed = final_df[metric].apply(parse_interval)
        final_df[f'{metric}_min'] = parsed.apply(lambda x: x[0])
        final_df[f'{metric}_max'] = parsed.apply(lambda x: x[1])
        final_df[f'{metric}_mid'] = parsed.apply(lambda x: x[2])
        
    # Deduplicate
    print("Deduplicating...")
    before_count = len(final_df)
    # Sort by year descending to potentially keep latest data if there are differences (though we expect them to be same)
    final_df = final_df.sort_values('year', ascending=False)
    final_df = final_df.drop_duplicates(subset=['manufacturer', 'product_type', 'year'], keep='first')
    after_count = len(final_df)
    print(f"Removed {before_count - after_count} duplicate rows.")
    
    # Save
    # Save
    output_file_csv = '../data_cleaned/value_measures_motor_clean.csv'
    final_df.to_csv(output_file_csv, index=False)
    print(f"Saved processed data to {output_file_csv}")

    output_file_json = '../data_cleaned/value_measures_motor_clean.json'
    final_df.to_json(output_file_json, orient='records', indent=4)
    print(f"Saved processed data to {output_file_json}")
    print(final_df.head())
    print(final_df.info())


if __name__ == "__main__":
    main()
