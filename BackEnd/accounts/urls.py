from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.api.customers_views import (all_customers, customer_by_id,
                                          customer_data_by_id)

from .views import (GetCSRFToken, MyTokenObtainPairView, add_comment,
                    delete_comment, get_comments, get_comments_byid,
                    registration_customer_view, registration_view)

app_name = 'accounts'

urlpatterns = [
    path('register', registration_view, name='register'),
    path('register_customer', registration_customer_view, name='register'),
    path('token', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('csrf_cookie', GetCSRFToken.as_view()),
    path('comments', get_comments, name='comments'),
    path('add_comment/<str:id>' , add_comment, name='comments'),
    path('comments_byid/<str:id>' , get_comments_byid, name='comments'),
    path('delete_comment/<str:id>' , delete_comment, name='comments'),
    path('customers' , all_customers, name='all_customers'),
    path('customer/<str:id>' , customer_by_id, name='customer_by_id'),
    path('customer/data/<str:id>' , customer_data_by_id, name='customer_by_id'),

]
