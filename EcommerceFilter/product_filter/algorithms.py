from .models import *
from django.db.models import Q


def filter_products(query_data):

    """Function to filter our products according to query_data"""

    query = query_data['search_query'].strip()
    category = query_data['current_category']
    refinements = [ref.lower() for ref in query_data.getlist('refinements[]')]
    price_range = query_data.getlist('price_range[]')
    sort = query_data['sort_by_price']
    warranty_years = query_data['warranty']

    # Filtering by price range
    products_list = Product.objects.filter(
        Q(product_price__gte=int(price_range[0] if price_range[0] != '' else 0)) &
        Q(product_price__lte=int(price_range[1] if price_range[1] != '' else 10000))
    )

    # Filtering by category
    if category != '':
        category = Category.objects.get(pk=category)
        products_list = products_list.filter(product_category=category)

    # Filtering by warranty years
    if warranty_years != '0':
        products_list = products_list.filter(warranty=int(warranty_years))

    # Filtering by refinements and tags & search keywords
    if refinements:
        products_list = products_list.filter(brand__in=refinements)

    products_list = products_list.filter(
        Q(brand__icontains=query) | Q(product_title__icontains=query)
    )

    # Sorting if sort is selected

    if sort == 'true':
        products_list = products_list.order_by('-product_price')

    elif sort == 'false':
        products_list = products_list.order_by('product_price')

    return products_list
