
setup.textify = function (passageName, currentPassage) {
  if (currentPassage) State.variables.currentPassage = currentPassage
  State.temporary.isTextOutput = true
  const raw = Story.get(passageName).processText()
  const $offshore = $('<div />')
  $offshore.wiki(raw)
  $offshore.find('button').remove()
  $offshore.find('.interactive-only').remove()
  return `${Util.escape($offshore.html())}`
}

setup.outputEverything = () => {
  const output = {
    start: setup.textify('Start'),
    town: setup.textify('TownOutput'),
    buildings: {},
    factions: {},
    npcs: {}
  }
  for (const building of State.variables.town.buildings) {
    output.buildings[building.key] = {
      name: building.name,
      key: building.key,
      output: setup.textify(building.passageName, building)
    }
  }
  for (const faction of Object.values(State.variables.town.factions)) {
    output.factions[faction.key] = {
      name: faction.name,
      key: faction.key,
      output: setup.textify(faction.passageName, faction)
    }
  }

  for (const npc of Object.values(State.variables.npcs)) {
    output.npcs[npc.key] = {
      name: npc.name,
      key: npc.key,
      output: setup.textify(npc.passageName, npc)
    }
  }
  const json = JSON.stringify(output)
  return json
}

$(document).on(':passageinit', function () {
  const params = new URL(document.location).searchParams
  const key = params.get('export')
  if (key) {
    // const obj = setup.findViaKey(key)
    Engine.play('BlankOutput', true)
    // $('#everything').text(setup.textify(obj.passageName, obj))
  }
})

setup.copyText = () => {
  const copyText = document.querySelector('#everything').innerHTML
  const jsonText = JSON.stringify(copyText)
  updateClipboard(jsonText)
}

function updateClipboard (copyText) {
  navigator.clipboard.writeText(copyText).then(function () {
    setup.notify('Copied to the clipboard successfully!')
  }, function () {
    setup.notify('Copy to the clipboard failed!')
  })
}
