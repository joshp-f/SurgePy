from functools import wraps
import json
log = {}
def surge(f):
  @wraps(f)
  def wrapper(*args, **kwds):
    log[f.__name__] = args,kwds
    with open('.surgetypes','w+') as surgetypesfile:
      surgetypesfile.write(json.dumps(log))
    return f(*args, **kwds)
  return wrapper