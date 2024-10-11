from django.urls import path
from . import views

urlpatterns=[
    path("notes/",views.NoteListCreate.as_view(),name="note-list"),
    path("notes_manager_pending/",views.NoteListCreateManagerPending.as_view(),name="note-list-manager"),
    path("notes_manager_accepted/",views.NoteListCreateManagerAccepted.as_view(),name="note-list-manager"),
    path("notes_manager_rejected/",views.NoteListCreateManagerRejected.as_view(),name="note-list-manager"),
    path("notes/delete/<int:pk>/",views.NoteDelete.as_view(),name="delete-note"),
    path("notes/<int:pk>/",views.NoteStatusUpdate.as_view(),name="update-note-status"),
    path("taskaddition/<int:note_id>/<str:date>/",views.TaskCreateView.as_view(),name="task-addition"),
    path('tasks/<int:pk>/', views.TaskDetailView.as_view(), name='task-detail'),
    path('profile/<str:username>/', views.UserProfileView2.as_view(), name='user-profile'),
    path('update-profile/<str:username>/', views.UpdateUserProfileView.as_view(), name='update-user-profile'),
    path('tasks/',views.TaskView.as_view(),name='TaskView'),
    path('get/allprofiles/',views.ProfileManagerView.as_view(),name="getallprofiles"),
    path('get/allprofilesadmin/',views.ProfileAdminView.as_view(),name="getallprofiles"),
    # path('update/role/<str:username>/',views.roleChangeView.as_view(),name="change-role"),
    path('get/notificationsemployee/',views.NotificationEmployeeView.as_view(),name="notification-employee"),
    path('get/notificationsmanager/',views.NotificationManagerView.as_view(),name="notification-manager"),
    path('post/notifications/',views.NotificationCreateView.as_view(),name="notification-create"),
    path('update/notif/<int:pk>/',views.NotificationUpdateView.as_view(),name="notification-update"),
]