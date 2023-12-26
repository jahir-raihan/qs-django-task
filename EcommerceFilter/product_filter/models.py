from django.contrib.auth import get_user_model
from django.db import models
from PIL import Image

User = get_user_model()


# Category model
class Category(models.Model):

    """Category model"""

    category_name = models.CharField(max_length=30)

    def __str__(self):
        return f'{self.category_name}'


# Sellers

class Seller(models.Model):

    """Seller model"""

    seller_name = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.seller_name}'


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
    seller = models.ForeignKey(Seller, on_delete=models.DO_NOTHING, null=True, blank=True)

    # Product image
    product_primary_image = models.ImageField(upload_to='product_primary_images/')

    def save(self, *args, **kwargs):

        """Overriding save method to reduce  size of uploaded image."""

        super(Product, self).save(*args, **kwargs)
        if self.product_primary_image:

            image = Image.open(self.product_primary_image.path)
            print(image.size)

            if image.width > 300 or image.height > 300:
                output_size = (300, 300)
                image.thumbnail(output_size)
                image.save(self.product_primary_image.path)
                print("Image size reduced", image.size)

    def __str__(self):
        return f'({self.id}), {self.product_title}'

