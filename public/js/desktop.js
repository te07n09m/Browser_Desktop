const searchForm = document.getElementById('search-form')
const shortcutContextMenu = document.getElementById('shortcut-contextmenu')
const editShortcutForm = document.getElementById('edit-shortcut-form')
const editShortcutTitle = document.getElementById('edit-shortcut-title')
const editShortcutUrl = document.getElementById('edit-shortcut-url')
const currentShortcut = document.getElementById('current-shortcut')
const deleteShortcut = document.getElementById('delete-shortcut')
const shortcuts = document.getElementsByClassName('shortcut')
const navShortcuts = document.getElementsByClassName('nav-shortcut')

let mouseX = 0
let mouseY = 0

const showContextMenu = (contextMenu) => {
    contextMenu.style.left = `${mouseX}px`
    contextMenu.style.top = `${mouseY}px`

    contextMenu.style.display = 'block'
}

const showShortcutContextMenu = (e, shortcut) => {
    e.preventDefault()

    currentShortcut.innerHTML = shortcut.children[0].innerHTML
    editShortcutForm.action = `/shortcut/edit/${JSON.parse(currentShortcut.innerHTML)._id}`
    editShortcutTitle.value = JSON.parse(currentShortcut.innerHTML).title
    editShortcutUrl.value = JSON.parse(currentShortcut.innerHTML).url
    deleteShortcut.action = `/shortcut/delete/${JSON.parse(currentShortcut.innerHTML)._id}`

    showContextMenu(shortcutContextMenu)
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
})

document.addEventListener('click', () => {
    setTimeout(() => {
        shortcutContextMenu.style.display = 'none'
    }, 50)
})

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const url = `https://www.google.com/search?q=${encodeURIComponent(formData.get('searchword'))}`
    window.open(url, '_blank')
})

for(let shortcut of shortcuts) {
    shortcut.addEventListener('contextmenu', (e) => {
        showShortcutContextMenu(e, shortcut)
    })
}

for(let shortcut of navShortcuts) {
    shortcut.addEventListener('contextmenu', (e) => {
        showShortcutContextMenu(e, shortcut)
    })
}
