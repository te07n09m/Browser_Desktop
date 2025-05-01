const allElements = document.querySelectorAll('*')
const searchForm = document.getElementById('search-form')
const shortcutContextMenu = document.getElementById('shortcut-contextmenu')
const editShortcutForm = document.getElementById('edit-shortcut-form')
const editShortcutTitle = document.getElementById('edit-shortcut-title')
const editShortcutUrl = document.getElementById('edit-shortcut-url')
const editShortcutFolder = document.getElementById('edit-shortcut-folder')
const currentShortcut = document.getElementById('current-shortcut')
const deleteShortcut = document.getElementById('delete-shortcut')
const folderContextMenu = document.getElementById('folder-contextmenu')
const editFolderForm = document.getElementById('edit-folder-form')
const editFolderTitle = document.getElementById('edit-folder-title')
const currentFolder = document.getElementById('current-folder')
const deleteFolder = document.getElementById('delete-folder')
const shortcuts = document.getElementsByClassName('shortcut')
const folders = document.getElementsByClassName('folder')
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

    currentShortcut.dataset.json = shortcut.dataset.json
    editShortcutForm.action = `/shortcut/edit/${JSON.parse(currentShortcut.dataset.json)._id}`
    editShortcutTitle.value = JSON.parse(currentShortcut.dataset.json).title
    editShortcutUrl.value = JSON.parse(currentShortcut.dataset.json).url
    editShortcutFolder.value = JSON.parse(currentShortcut.dataset.json).folder
    deleteShortcut.action = `/shortcut/delete/${JSON.parse(currentShortcut.dataset.json)._id}`

    showContextMenu(shortcutContextMenu)
}

const showFolderContextMenu = (e, folder) => {
    e.preventDefault()

    currentFolder.dataset.json = folder.dataset.json
    editFolderForm.action = `/folder/edit/${JSON.parse(currentFolder.dataset.json)._id}`
    editFolderTitle.value = JSON.parse(currentFolder.dataset.json).title
    deleteFolder.action = `/folder/delete/${JSON.parse(currentFolder.dataset.json)._id}`

    showContextMenu(folderContextMenu)
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
})

document.addEventListener('click', () => {
    setTimeout(() => {
        shortcutContextMenu.style.display = 'none'
        folderContextMenu.style.display = 'none'
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

for(let folder of folders) {
    folder.addEventListener('contextmenu', (e) => {
        showFolderContextMenu(e, folder)
    })
}

allElements.forEach(element => {
    element.draggable = false
})
