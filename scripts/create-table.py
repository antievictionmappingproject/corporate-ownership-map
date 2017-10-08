#!/usr/local/bin/python
import pandas as pd
import sys

file_name = sys.argv[1]
df = pd.read_csv(file_name)
df.columns = [c.lower() for c in df.columns] #postgres doesn't like capitals
df.columns = ['-'.join(c.split()) for c in df.columns] #postgres doesn't like spaces

from sqlalchemy import create_engine
engine = create_engine('postgresql://bob:password123@localhost:5432/ownership', client_encoding='utf8')

df.to_sql("sf-ownership", engine)
