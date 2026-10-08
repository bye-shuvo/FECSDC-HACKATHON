const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const controller = require('../controller/adminController');
const crud = require('../controller/adminCrudController');
const csrf = require('../middleware/adminCsrf');

const router = express.Router();

router.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'same-origin',
  });
  next();
});

router.use(adminAuth);
router.get('/', controller.dashboard);

const resources = ['users', 'questions', 'submissions'];
const parseForm = express.urlencoded({ extended: false, limit: '32kb' });

router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return next('route');
  next();
});

for (const resource of resources) {
  router.get(`/${resource}`, crud.list(resource));
  router.get(`/${resource}/new`, crud.newForm(resource));
  router.post(`/${resource}`, parseForm, csrf.mutationLimiter, csrf.verify(csrf.actionFor(resource, 'create')), crud.create(resource));
}

for (const resource of resources) {
  router.get(`/${resource}/:id/edit`, crud.editForm(resource));
  router.post(`/${resource}/:id`, parseForm, csrf.mutationLimiter, csrf.verify((req) => csrf.actionFor(resource, 'update', req.params.id)), crud.update(resource));
  router.get(`/${resource}/:id/delete`, crud.deleteConfirm(resource));
  router.post(`/${resource}/:id/delete`, parseForm, csrf.mutationLimiter, csrf.verify((req) => csrf.actionFor(resource, 'delete', req.params.id)), crud.remove(resource));
}

router.use(controller.notFound);
router.use(controller.handleError);

module.exports = router;