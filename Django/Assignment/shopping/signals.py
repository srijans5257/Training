from django.dispatch import receiver
from django.db.models.signals import pre_save,post_save
from .models import shopping_item

@receiver(pre_save,sender=shopping_item)
def pre_save_signal(sender,instance,**kwargs):
    print(f'Pre-save:{instance}')

@receiver(post_save,sender=shopping_item)
def post_save_signal(sender,instance,**kwargs):
    print(f'Post-Save:{instance}')
