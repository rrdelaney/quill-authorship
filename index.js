const USERNAME = 'REDMOND\\rydelan'
const Inline = Quill.import('blots/inline')

@Quill.register
class Change extends Inline {
  static create({ username, changeType }) {
    const node = super.create()
    
    node.setAttribute('owner', username)
    node.setAttribute('data-change-type', changeType)

    return node
  }

  static formats(node) {
    return {
      owner: node.getAttribute('owner'),
      changeType: node.getAttribute('data-change-type')
    }
  }

  static blotName = 'change';
	static tagName = 'span';
}

Quill.register('modules/trackChanges', editor => {
	editor.on('text-change', (delta, old, source) => {
  })
})

const toolbar = [
	{ change: { changeType: 'accepted' } }
]

const editor = new Quill('#editor', {
	modules: {
  	toolbar,
    trackChanges: true
  }
})

editor.insertText(0, 'This is a change\n', 'change', {
	changeType: 'insert',
  username: USERNAME
})

editor.insertText(0, 'This is a delete\n', 'change', {
	changeType: 'delete',
  username: USERNAME
})

editor.formatText(0, 4, { 
	change: { changeType: 'accepted' }
})
