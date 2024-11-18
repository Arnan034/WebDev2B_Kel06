import axiosInstance from '../config/axios';

export const apiServicePublic = {
  //actor
  getActorByIdFilm: (id_film) => axiosInstance.get(`/api/actor/get-by-id-film/${id_film}`),
  getActorById: (id) => axiosInstance.get(`/api/actor/get-by-id/${id}`),

  // Auth
  signIn: (data) => axiosInstance.post('/api/auth/sign-in', data),
  signOut: () => axiosInstance.post('/api/auth/sign-out'),
  signUp: (data) => axiosInstance.post('/api/auth/sign-up', data),
  verifyOTP: (data) => axiosInstance.post('/api/auth/verify-otp', data),
  resendOTP: (data) => axiosInstance.post('/api/auth/resend-otp', data),
  signGoogle: (data) => axiosInstance.post('/api/auth/google-sign-in', data),
  forgetPassword: (data) => axiosInstance.post('/api/auth/forget-password', data),
  resetPassword: (data) => axiosInstance.put('/api/auth/reset-password', data),

  //award
  getInstitutionAward: () => axiosInstance.get('/api/award/get-institution'),

  //comment
  getCommentByIdFilm: (id_film, data) => axiosInstance.get(`/api/comment/get-by-film/${id_film}`, { params: data }),

  //country
  getAllCountry: () => axiosInstance.get('/api/country/get-all'),

  //film
  getAllFilm: (data) => axiosInstance.get('/api/film/get-all', { params: data }),
  getFilmSearch: (data) => axiosInstance.get('/api/film/search',{ params: data }),
  getFilmById: (id) => axiosInstance.get(`/api/film/get-by-id/${id}`),
  updatePlusView: (id) => axiosInstance.post(`/api/film/increment-view/${id}`),

  //filter
  getYears: () => axiosInstance.get('/api/filter/years'),
  getAvailabilitys: () => axiosInstance.get('/api/filter/availability'),

  //genre
  getAllGenre: () => axiosInstance.get('/api/genre/get-all'),
};

export const apiServiceAuth = {
  //actor
  getAllActor: () => axiosInstance.get('/auth/actor/get-all'),

  //award
  getUnselectedAward: () => axiosInstance.get('/auth/award/get-unselected'),

  //award
  createAward: (data) => axiosInstance.post('/auth/award/create', data),

  //bookmark
  getBookmarkFilm: (userId) => axiosInstance.get(`/auth/bookmark/get-bookmark/${userId}`),
  getUserBookmarkFilm: (userId, filmId) => axiosInstance.get(`/auth/bookmark/get-user-bookmark/${userId}/${filmId}`),
  createBookmark: (data) => axiosInstance.post('/auth/bookmark/create', data),
  deleteBookmark: (userId, filmId) => axiosInstance.delete(`/auth/bookmark/delete/${userId}/${filmId}`),

  //comment
  createComment: (userId, filmId, data) => axiosInstance.post(`/auth/comment/create/${userId}/${filmId}`, data),

  //film
  createFilm: (data) => axiosInstance.post('/auth/film/create', data),
};

export const apiServiceAdmin = {
  //actor
  createActor: (data) => axiosInstance.post('/admin/actor/create', data),
  updateActor: (id, data) => axiosInstance.put(`/admin/actor/update/${id}`, data),
  deleteActor: (id) => axiosInstance.delete(`/admin/actor/delete/${id}`),

  //auth
  getUserMonitoring: (data) => axiosInstance.post('/admin/auth/get-user-monitoring', data),
  updateStatus: (id, data) => axiosInstance.put(`/admin/auth/update-status/${id}`, data),

  //award
  getAllAward: () => axiosInstance.get('/admin/award/get-all'),
  createAward: (data) => axiosInstance.post('/admin/award/create', data),
  updateAward: (id, data) => axiosInstance.put(`/admin/award/update/${id}`, data),
  deleteAward: (id) => axiosInstance.delete(`/admin/award/delete/${id}`),

  //comment
  getAllComment: (data) => axiosInstance.get('/admin/comment/get-all', data),
  updateApproveComment: (data) => axiosInstance.put(`/admin/comment/update-approve`, data),
  deleteComment: (data) => axiosInstance.delete(`/admin/comment/delete`, { data: data }),

  //country
  createCountry: (data) => axiosInstance.post('/admin/country/create', data),
  updateCountry: (id, data) => axiosInstance.put(`/admin/country/update/${id}`, data),
  deleteCountry: (id) => axiosInstance.delete(`/admin/country/delete/${id}`),

  //film
  getValidateFilms: (data) => axiosInstance.get('/admin/film/validate', data),
  getEditFilm: (id) => axiosInstance.get(`/admin/film/get-edit/${id}`),
  updateFilmValidate: (id, data) => axiosInstance.put(`/admin/film/update-validate/${id}`, data),
  saveEditValidate: (id, data) => axiosInstance.put(`/admin/film/save-edit/${id}`, data),
  deleteFilm: (id) => axiosInstance.delete(`/admin/film/delete/${id}`),

  //genre
  createGenre: (data) => axiosInstance.post('/admin/genre/create', data),
  updateGenre: (id, data) => axiosInstance.put(`/admin/genre/update/${id}`, data),
  deleteGenre: (id) => axiosInstance.delete(`/admin/genre/delete/${id}`),
};

// Perbaikan export default
const apiServices = {
  public: apiServicePublic,
  auth: apiServiceAuth,
  admin: apiServiceAdmin
};

export default apiServices;