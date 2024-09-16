from django.urls import path
from django.contrib import admin
from . import views
urlpatterns=[
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('item_list/', views.item_list, name='item_list'),
    path('form/',views.form,name='form'),
    path('login/',views.login_view,name='login'),
    path('signup/',views.signup_view,name='signup'),
    path('change_password/',views.change_password,name='change_password'),
    path('logout/',views.logout_view,name="logout"),
    path('admin_view/',views.admin_only,name='admin_only'),
    path('api/',views.apioverview,name="api-overview"),
    path('api/read',views.read,name='api-read'),
    path('api/create',views.create,name='api-create'),
    path('api/update/<str:pk>/',views.update,name='api-update'),
    path('api/delete/<str:pk>/',views.delete,name='api-delete'),
]
