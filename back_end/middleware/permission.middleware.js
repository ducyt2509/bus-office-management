module.export = {
  checkRole(req, res, next) {
    sessionStorage.getItem('role_id') == 1 ? next() : '';
    return;
  }
};
