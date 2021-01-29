


function validator(formValidate) {

  function getParent(element, selector) {
    return element.parentElement
  }
  const formRules = {}
  const validatorRules = {
    require: function (value) {
      return value.length ? undefined : 'Vui lòng nhập trường này'
    },
    email: function (value) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(value) ? undefined : 'Email không hợp lệ'
    },
    min: function (min) {
      return function (value) {
        return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`
      }
    }
  }
  // GET Element Form
  const formElement = document.querySelector(formValidate);
  if (formElement) {
    // GET Element Input
    const inputs = document.querySelectorAll('[name][rules]')
    inputs.forEach((input) => {
      const rules = input.getAttribute('rules').split('|')
      var ruleLength = 0;
      for (var rule of rules) {
        if (rule.includes(':')) {
          const ruleInfo = rule.split(':')
          rule = ruleInfo[0]
          ruleLength = Number(ruleInfo[1])
        }
        if (Array.isArray(formRules[input.name])) {
          ruleLength === 0 ? formRules[input.name].push(validatorRules[rule]) :
            formRules[input.name].push(validatorRules[rule](ruleLength))
          ruleLength = 0
        }
        else {
          ruleLength === 0 ? formRules[input.name] = [validatorRules[rule]] :
            formRules[input.name] = [validatorRules[rule](ruleLength)]
          ruleLength = 0
        }
      }

      input.onblur = handleError
      input.oninput = handleClearError
    })
    function handleError(event) {
      const rules = formRules[event.target.name]
      var errors;
      rules.find((rule) => {
        errors = rule(event.target.value)
        return errors
      })
      const formGroup = getParent(event.target, 'form-group')
      if (formGroup && errors) {
        formGroup.querySelector('.error').innerText = errors
        event.target.classList.add('active')
      }
    }
    function handleClearError(event) {
      const formGroup = getParent(event.target, 'form-group')
      if (formGroup) {
        formGroup.querySelector('.error').innerText = ''
        event.target.classList.remove('active')
      }
    }

    formElement.onsubmit = (event) => {
      event.preventDefault();
      inputs.forEach((input) => {
        handleError({ target: input })
      })
    }
  }
}