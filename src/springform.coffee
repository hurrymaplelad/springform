class Springform
  constructor: (attrs={}) ->
    @[key] = value for key, value of attrs

    @fieldErrors ?= {}
    @formError = null

    @fields ?= []
    for field in @fields
      field.prefix = @prefix
      field.label ?= @nameToLabel field.name
      field.id ?= [@prefix, field.name].join '-'
      @fields[field.name] = field

  bind: (data) ->
    @data = data
    @

  prunedData: ->
    _(data).pick _(@fields).pluck 'name'

  errors: (errors) ->
    if arguments.length
      @formError = errors.formError
      @fieldErrors = errors.fieldErrors or []
      return @
    else
      {@formError, @fieldErrors}

  validate: (done) ->
    @formError = null
    @fieldErrors = {}
    gate = new Gate()
    for validator in @validators or []
      if validator.length > 1
        validator @, gate.callback()
      else
        validator @
    gate.finished done
    @

  hasErrors: ->
    Boolean(@formError) or
    Object.keys(@fieldErrors).some (key) =>
      Boolean @fieldErrors[key]

  nameToLabel: (name) -> name

  submit: (event) ->
    event?.preventDefault()
    @processing = true
    @process =>
      @processing = false

  process: (done) -> done()

  processor: (@process) -> @

Springform.validators =
  required: (form) ->
    for {name, required} in form.fields
      value = form.data[name]
      if required and not (value or value is false)
        form.fieldErrors[name] = 'required'

class Gate
  constructor: ->
    @callbacks = []
    @returnedCount = 0

  checkDone: ->
    if @returnedCount == @callbacks.length
      setTimeout @done, 0

  callback: ->
    called = false
    callback = =>
      return if called; called = true
      @returnedCount += 1
      @checkDone()
    @callbacks.push callback
    return callback

  finished: (callback) ->
    @done = callback
    @checkDone()

module?.exports = Springform
