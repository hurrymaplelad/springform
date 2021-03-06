// Generated by CoffeeScript 1.12.2
var Gate, Springform,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice;

Springform = (function() {
  function Springform(attrs) {
    var field, i, key, len, ref, value;
    if (attrs == null) {
      attrs = {};
    }
    this.submit = bind(this.submit, this);
    for (key in attrs) {
      value = attrs[key];
      this[key] = value;
    }
    if (this.fieldErrors == null) {
      this.fieldErrors = {};
    }
    this.formError = null;
    this.validators = this.validators ? this.validators.slice() : [];
    if (this.fields == null) {
      this.fields = [];
    }
    ref = this.fields;
    for (i = 0, len = ref.length; i < len; i++) {
      field = ref[i];
      this.fields[field.name] = field;
    }
  }

  Springform.prototype.set = function(key, value) {
    var args;
    if (typeof key === 'string') {
      this[key] = value;
    } else {
      args = key;
      for (key in args) {
        value = args[key];
        this[key] = value;
      }
    }
    return this;
  };

  Springform.prototype.prunedData = function() {
    return _(data).pick(_(this.fields).pluck('name'));
  };

  Springform.prototype.errors = function(errors) {
    if (arguments.length) {
      this.formError = errors.formError;
      this.fieldErrors = errors.fieldErrors || {};
      return this;
    } else {
      return {
        formError: this.formError,
        fieldErrors: this.fieldErrors
      };
    }
  };

  Springform.prototype.addValidator = function(validator) {
    this.validators.push(validator);
    return this;
  };

  Springform.prototype.validate = function(done) {
    var gate, i, len, ref, validator;
    this.formError = null;
    this.fieldErrors = {};
    gate = new Gate();
    ref = this.validators || [];
    for (i = 0, len = ref.length; i < len; i++) {
      validator = ref[i];
      if (validator.length > 1) {
        validator(this, gate.callback());
      } else {
        validator(this);
      }
    }
    gate.finished(done);
    return this;
  };

  Springform.prototype.hasErrors = function() {
    return Boolean(this.formError) || Object.keys(this.fieldErrors).some((function(_this) {
      return function(key) {
        return Boolean(_this.fieldErrors[key]);
      };
    })(this));
  };

  Springform.prototype.submit = function(event) {
    if (event != null) {
      event.preventDefault();
    }
    if (this.saving) {
      return;
    }
    this.saving = true;
    return this.save((function(_this) {
      return function() {
        return _this.saving = false;
      };
    })(this));
  };

  Springform.prototype.save = function(done) {
    return done();
  };

  return Springform;

})();

Springform.required = function() {
  var fields;
  fields = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  return function(arg) {
    var data, field, fieldErrors, i, len, results, value;
    data = arg.data, fieldErrors = arg.fieldErrors;
    results = [];
    for (i = 0, len = fields.length; i < len; i++) {
      field = fields[i];
      value = data[field];
      if (!(value || value === false)) {
        results.push(fieldErrors[field] = 'required');
      } else {
        results.push(void 0);
      }
    }
    return results;
  };
};

Gate = (function() {
  function Gate() {
    this.callbacks = [];
    this.returnedCount = 0;
  }

  Gate.prototype.checkDone = function() {
    if (this.returnedCount === this.callbacks.length && (this.done != null)) {
      return setTimeout(this.done, 0);
    }
  };

  Gate.prototype.callback = function() {
    var callback, called;
    called = false;
    callback = (function(_this) {
      return function() {
        if (called) {
          return;
        }
        called = true;
        _this.returnedCount += 1;
        return _this.checkDone();
      };
    })(this);
    this.callbacks.push(callback);
    return callback;
  };

  Gate.prototype.finished = function(callback) {
    this.done = callback;
    return this.checkDone();
  };

  return Gate;

})();

if (typeof module !== "undefined" && module !== null) {
  module.exports = Springform;
}
