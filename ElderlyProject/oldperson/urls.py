'''
Created on 06-Nov-2019

@author: achauhan
'''

from django.urls import path
from oldperson import views
from django.views.generic.base import RedirectView
from rest_framework import routers
from django.urls.conf import include


router = routers.DefaultRouter()
router.register(r'oldperson', views.OldpersonViewSet)

urlpatterns = [
#     path('home/', views.home),
    path(r'api/', include(router.urls)),
#     path('', RedirectView.as_view(url = "home/")),
    path('', RedirectView.as_view(url = "api/")),
]
