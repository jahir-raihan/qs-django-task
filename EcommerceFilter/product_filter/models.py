from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


# Category model
class Category(models.Model):

    """Category model"""

    category_name = models.CharField(max_length=30)

    def __str__(self):
        return f'{self.category_name}'


class Product(models.Model):

    """Product model"""

    # Product details
    product_title = models.CharField(max_length=200)
    product_code = models.CharField(max_length=15)
    product_price = models.IntegerField()
    product_category = models.ForeignKey(Category, on_delete=models.DO_NOTHING)
    warranty = models.IntegerField(default=1, null=True, blank=True)
    brand = models.CharField(max_length=30)
    product_in_stock = models.BooleanField(default=True)
    product_added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, default=1)

    # Product image
    product_primary_image = models.ImageField(upload_to='product_primary_images/')

    def __str__(self):
        return f'({self.id}), {self.product_title}'

