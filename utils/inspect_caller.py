import inspect


def inspect_caller():
    stack = inspect.stack()
    if not len(stack):
        return None
    frame = None
    i = 2
    while i < len(stack):
        frame = stack[i]
        if frame.function != 'decorator':
            break
    return f"{frame.filename}:{frame.lineno}: {frame.function} (code: '{frame.code_context})')"