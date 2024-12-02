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

  //performance
  performance: () => axiosInstance.get('/admin/performance')
};

// Perbaikan export default
const apiServices = {
  public: apiServicePublic,
  auth: apiServiceAuth,
  admin: apiServiceAdmin
};

export default apiServices;

// ini kode api.js menggunakan fetch biasa (untuk melakukan test front end)
// const API_URL = 'http://localhost:5000';

// // Public API Services
// export const apiServicePublic = {
//   // Actor
//   getActorByIdFilm: (id_film) =>
//     fetch(`${API_URL}/api/actor/get-by-id-film/${id_film}`).then((res) => res.json()),
//   getActorById: (id) =>
//     fetch(`${API_URL}/api/actor/get-by-id/${id}`).then((res) => res.json()),

//   // Auth
//   signIn: (data) =>
//     fetch(`${API_URL}/api/auth/sign-in`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
//   signOut: () =>
//     fetch(`${API_URL}/api/auth/sign-out`, { method: 'POST' }).then((res) => res.json()),
//   signUp: (data) =>
//     fetch(`${API_URL}/api/auth/sign-up`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
//   verifyOTP: (data) =>
//     fetch(`${API_URL}/api/auth/verify-otp`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
//   resendOTP: (data) =>
//     fetch(`${API_URL}/api/auth/resend-otp`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
//   signGoogle: (data) =>
//     fetch(`${API_URL}/api/auth/google-sign-in`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
//   forgetPassword: (data) =>
//     fetch(`${API_URL}/api/auth/forget-password`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
//   resetPassword: (data) =>
//     fetch(`${API_URL}/api/auth/reset-password`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),

//   // Award
//   getInstitutionAward: () =>
//     fetch(`${API_URL}/api/award/get-institution`).then((res) => res.json()),

//   // Comment
//   getCommentByIdFilm: (id_film, data) =>
//     fetch(`${API_URL}/api/comment/get-by-film/${id_film}`, {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),

//   // Country
//   getAllCountry: () =>
//     fetch(`${API_URL}/api/country/get-all`).then((res) => res.json()),

//   // Film
//   getAllFilm: (data) =>
//     fetch(`${API_URL}/api/film/get-all`, {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
//   getFilmSearch: (data) =>
//     fetch(`${API_URL}/api/film/search`, {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
//   getFilmById: (id) =>
//     fetch(`${API_URL}/api/film/get-by-id/${id}`).then((res) => res.json()),
//   updatePlusView: (id) =>
//     fetch(`${API_URL}/api/film/increment-view/${id}`, { method: 'POST' }).then((res) => res.json()),

//   // Filter
//   getYears: () =>
//     fetch(`${API_URL}/api/filter/years`).then((res) => res.json()),
//   getAvailabilitys: () =>
//     fetch(`${API_URL}/api/filter/availability`).then((res) => res.json()),

//   // Genre
//   getAllGenre: () =>
//     fetch(`${API_URL}/api/genre/get-all`).then((res) => res.json()),
// };

// // Auth API Services
// export const apiServiceAuth = {
//   // Actor
//   getAllActor: () =>
//     fetch(`${API_URL}/auth/actor/get-all`).then((res) => res.json()),

//   // Award
//   getUnselectedAward: () =>
//     fetch(`${API_URL}/auth/award/get-unselected`).then((res) => res.json()),
//   createAward: (data) =>
//     fetch(`${API_URL}/auth/award/create`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),

//   // Bookmark
//   getBookmarkFilm: (userId) =>
//     fetch(`${API_URL}/auth/bookmark/get-bookmark/${userId}`).then((res) => res.json()),
//   getUserBookmarkFilm: (userId, filmId) =>
//     fetch(`${API_URL}/auth/bookmark/get-user-bookmark/${userId}/${filmId}`).then((res) => res.json()),
//   createBookmark: (data) =>
//     fetch(`${API_URL}/auth/bookmark/create`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
//   deleteBookmark: (userId, filmId) =>
//     fetch(`${API_URL}/auth/bookmark/delete/${userId}/${filmId}`, {
//       method: 'DELETE',
//     }).then((res) => res.json()),

//   // Comment
//   createComment: (userId, filmId, data) =>
//     fetch(`${API_URL}/auth/comment/create/${userId}/${filmId}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),

//   // Film
//   createFilm: (data) =>
//     fetch(`${API_URL}/auth/film/create`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
// };

// Admin API Services
// export const apiServiceAdmin = {
//   // Actor
//   createActor: (data) =>
//     fetch(`${API_URL}/admin/actor/create`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
//   updateActor: (id, data) =>
//     fetch(`${API_URL}/admin/actor/update/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
//   deleteActor: (id) =>
//     fetch(`${API_URL}/admin/actor/delete/${id}`, {
//       method: 'DELETE',
//     }).then((res) => res.json()),

//   // Auth
//   getUserMonitoring: (data) =>
//     fetch(`${API_URL}/admin/auth/get-user-monitoring`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
//   updateStatus: (id, data) =>
//     fetch(`${API_URL}/admin/auth/update-status/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),

//   // Award
//   getAllAward: () =>
//     fetch(`${API_URL}/admin/award/get-all`).then((res) => res.json()),
//   createAward: (data) =>
//     fetch(`${API_URL}/admin/award/create`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
//   updateAward: (id, data) =>
//     fetch(`${API_URL}/admin/award/update/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
//   deleteAward: (id) =>
//     fetch(`${API_URL}/admin/award/delete/${id}`, { method: 'DELETE' }).then((res) => res.json()),

//   // Comment
//   getAllComment: (data) =>
//     fetch(`${API_URL}/admin/comment/get-all`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
//   updateApproveComment: (data) =>
//     fetch(`${API_URL}/admin/comment/update-approve`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
//   deleteComment: (data) =>
//     fetch(`${API_URL}/admin/comment/delete`, {
//       method: 'DELETE',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then((res) => res.json()),
// };