def underscore(string : str):
    l = list()
    for n, symbol in enumerate(string):

        if symbol.isupper() and n > 0 and  not string[n-1].isupper():
            if string[n:] == 'Vms': # VMs may be camelCased that way
                l.append('_VMs')
                break

            l.extend(['_', symbol.lower()])
        else:
            l.append(symbol)

    return "".join(l)


def camelcase(string: str):
    l = list()
    capitalize = False
    for n, symbol in enumerate(string):
        if capitalize:
            l.append(symbol.upper())
            capitalize = False
        elif symbol == '_':
            capitalize = True
        else:
            l.append(symbol)


    return "".join(l)
