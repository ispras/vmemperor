DEFAULT_PAGE_SIZE=20

def do_paging(query, page, page_size=DEFAULT_PAGE_SIZE):
    return query.slice((page - 1) * page_size, page_size)
