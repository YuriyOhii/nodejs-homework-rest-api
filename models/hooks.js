const handleError400 = (err, data, next) => {
  err.status = 400;
  next();
};

const updateOptions = function (next) {
  this.options.new = true;
  this.options.runValidators;
  next();
};

export { handleError400, updateOptions };
