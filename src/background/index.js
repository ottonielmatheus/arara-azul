const { v4: uuidv4 } = require('uuid')
const { delegate } = require('tippy.js')

const flags = []
const translateLanguageCode = 'ru'

document.addEventListener('mouseup', async () => {
  const selection = document.getSelection()

  if (selection && selection.focusNode) {
    const text = selection.toString()
    const selectedElement = selection.focusNode.parentElement
    const alreadyTranslated = hasFlag(selectedElement)

    if (selectedElement && text.trim() && !alreadyTranslated) {

      translateIt(text).then(translatedText => {
        const highlighted = highlightIt(text)

        selectedElement.innerHTML = selectedElement.innerHTML.replace(text, highlighted.outerHTML)
        popIt(translatedText, highlighted)
      })
    }
  }
})

async function translateIt(text) {
  const res = await fetch('https://libretranslate.de/translate', {
    method: 'POST',
    body: JSON.stringify({
      q: text,
      source: 'auto',
      target: translateLanguageCode || 'en'
    }),
    headers: { 'Content-Type': 'application/json' }
  })

  const resBody = await res.json()
  return resBody.translatedText
}

function popIt(text, element) {
  const elementId = '#' + element.id
  const tooltipStyle = `
    display: flex;
    flex-direction: column;
    background-color: white;
    border: solid .5px #f1f1f1;
    border-radius: 3px;
    font-size: 15px;
    color: #181818;
    box-shadow: 0 1px 4px -2px black, inset 0 2px 1px -1px rgb(255 255 255 / 10%);
    animation: all 1s ease;
  `
  const tooltipBodyStyle = `
    display: flex;
    flex-wrap: wrap;
    padding: 10px 15px;
    font-weight: 600;
  `
  const tooltipFooterStyle = `
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-top: solid .4px #dcdcdc;
  `

  delegate(document.body, {
    target: elementId,
    content: `<div style="${tooltipStyle}">
      <span style="${tooltipBodyStyle}">${text}</span>
      <span style="${tooltipFooterStyle}">
        <img width="20px" height="20px" style="border-radius: 50%; margin-right: 10px; border: solid .5px #f5f5f5;"
          src="https://flagcdn.com/w40/${translateLanguageCode}.png"/>
        <small><i>Translated by</i>&nbsp; <b>LibreTranslate</b> ❤️</small>
      </span>
    </div>`,
    allowHTML: true
  })
}

function highlightIt(text) {
  const highlight = document.createElement('span')
  highlight.classList.add('aa-highlight')

  highlight.style.padding = '.2px 2px'
  highlight.style.backgroundColor = 'rgba(207, 236, 245, 0.5)'
  highlight.style.borderRadius = '3px'

  highlight.textContent = text
  flagIt(highlight)

  return highlight
}

function flagIt(element) {
  const newFlag = 'aa-' + uuidv4()
  element.id = newFlag
  flags.push(newFlag)
}

function hasFlag(element) {
  return flags.includes(element.id)
}