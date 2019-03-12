import traceback
from datetime import datetime


def print_graphql_exception(error):

    from tornado.options import options as opts
    with open(opts.graphql_error_log_file, 'a') as file:
        file.write(f"Date: {datetime.now().isoformat()}\n")
        traceback.print_exception(None, error, error.__traceback__, file=file)