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
    	changeType: node.getAttribute('data-change-type'),
      owner: node.getAttribute('owner')
    }
  }
  
  format(name, value) {
  	if (name === 'change') {
    	const changeType = typeof value === 'string' ? JSON.parse(value).changeType : value.changeType
    	this.domNode.setAttribute('data-change-type', changeType)
    } else {
    	super.format(name, value)
    }
  }

  static blotName = 'change';
	static tagName = 'span';
}

Quill.register('modules/trackChanges', editor => {
	editor.on('text-change', (delta, old, source) => {
  	if (source !== 'user') return
    
    const ops = []
    delta.ops.forEach(op => {
      if (op.insert || (op.retain && op.attributes && !op.attributes.change)) {
          ops.push({ 
          	retain: op.retain || op.insert.length || 1,
            attributes: { change: { changeType: 'insert', username: USERNAME } }
          })
      } else {
      	ops.push({ retain: op.retain })
      }
    })
    
    editor.updateContents({ ops }, 'silent')
  })
})

const toolbar = [
	{ 
    change: JSON.stringify({ changeType: 'accepted' })
  }
]

const Keyboard = Quill.import('modules/keyboard')
console.log(Keyboard.keys)

const bindings = {
	handleBackspaceCollapsed: {
  	key: Keyboard.keys.BACKSPACE,
    collapsed: true,
    handler(range, context) {
    	if (range.index === 0) return
      this.quill.formatText(range.index - 1, 1, 'change', { changeType: 'delete' }, 'user')
      this.quill.setSelection(range.index - 1, 0)
    }
  },
  handleBackspace: {
  	key: Keyboard.keys.BACKSPACE,
    collapsed: false,
    handler(range, context) {
    	this.quill.format('change', { changeType: 'delete' }, 'user')
      this.quill.setSelection(range.index, 0)
    }
 }
}

const editor = new Quill('#editor', {
	modules: {
  	toolbar,
    keyboard: {
    	bindings
    },
    trackChanges: true
  },
  theme: 'snow'
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
