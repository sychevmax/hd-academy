# HDA Data Pipeline Tools

This directory contains the data processing scripts used to clean and transform the FCA General Insurance Value Measures dataset for the Hastings Direct Academy project.

## Overview

The main script `etl_value_measures.py` processes Excel files from the FCA, cleans the data, filters for specific manufacturers, and outputs a unified JSON file for the backend service.

## Prerequisites

*   Python 3.8+
*   `pip`

## Setup

1.  Navigate to this directory:
    ```bash
    cd data-pipeline/hda-data-tools
    ```

2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Usage

To run the ETL process manually:

```bash
# From the root of the hda-data-tools directory
python processing_scripts/etl_value_measures.py
```

This will:
1.  Read Excel files from `data_sources/fca_gi_value_measures/`.
2.  Clean and transform the data (parse percentages, bands to numeric ranges).
3.  Deduplicate entries.
4.  Output the cleaned data to `data_cleaned/value_measures_motor_clean.json` and `.csv`.

## Future Improvements

*   Automate this pipeline via GitHub Actions to run on a schedule or when new data is dropped into the `data_sources` folder.
*   Add data validation steps using `pydantic` or `pandera`.
