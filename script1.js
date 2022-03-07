const rootPopup = document.querySelector('.root-popup');
const popupCats = document.querySelector('.popup_type_cats-info');
const popupAddCats = document.querySelector('.popup_type_cats-add');
const popupEditCats = document.querySelector('.popup_type_cats-edit');


const formAdd = popupAddCats.querySelector('.popup__form');
const formEdit = popupEditCats.querySelector('.popup__form');

const inputId = formAdd.querySelector('#id');
const inputName = formAdd.querySelector('#name');
const inputImg = formAdd.querySelector('#img_link');
const inputDesc = formAdd.querySelector('#description');

// console.log(inputId, inputName, inputImg, inputDesc);

const popupCatsImage = popupCats.querySelector('.popup__image');
const popupCatsText = popupCats.querySelector('.popup__text');
const popupCatsName = popupCats.querySelector('.popup__name');

const catImages = document.querySelectorAll('.cat__image');
const closePopupCats = document.querySelector('.popup__close');
const cardTemplate = document.querySelector('#card-tempalte');
const cardListContainer = document.querySelector('.cats-list');

const buttonReloadData = document.querySelector('.reload-data');
const buttonAddCat = document.querySelector('#button-add-cat');

// console.dir(cardTemplate.content);

function formSerialize(form) {
    const result = {}
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        result[input.name] = input.value;
    })
    return result;
}


function getLocalStorageData(key){
    return JSON.parse(localStorage.getItem(key));
}

function setLocalStorageData(key, data){
    localStorage.setItem(key, JSON.stringify(data));
}


function openPopup(popup) {
    popup.classList.add('popup_opened');


}

function handleClickCloseBtn(event){
    if (event.target.classList.contains('popup__close')){
        closePopup();
    } 
}

function closePopup() {
        const popopActive = document.querySelector('.popup_opened');
        if (popopActive) {
            popopActive.classList.remove('popup_opened');
        } 
}

// function handleClosePopup() {
//     closePopup(popupCats)
// }


function createCardCat(dataCat) {
    const newCardElement = cardTemplate.content.querySelector('.cats-list__item').cloneNode(true);
    const cardImage = newCardElement.querySelector('.cat__image');
    const cardName = newCardElement.querySelector('.cat__title');
    const cardButtonDelete = newCardElement.querySelector('.cat__delete');
    const cardButtonEdit = newCardElement.querySelector('.cat__edit');

    cardImage.src = dataCat.img_link;
    cardImage.dataset.id = dataCat.id;
    cardName.textContent = dataCat.name;
   
    function handleClickCatImage() {
        //фетч на получение данных конкретной карточки
        //внутри then код который ниже использует ответ с сервера
            popupCatsImage.src = dataCat.img_link;
            popupCatsName.textContent = dataCat.name;
            popupCatsText.textContent = dataCat.description;
            openPopup(popupCats)
    }

    function handleClickCatEdit() {
            const inputs = formEdit.querySelectorAll('input');
            inputs.forEach(input => {
                input.value = dataCat[input.name];
            });
            openPopup(popupEditCats)
    }

    
    function handleClickButtonDelete() {
        fetch(`https://sb-cats.herokuapp.com/api/delete/${dataCat.id}`, {
            method: 'DELETE'
        })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }   
            return Promise.reject(response)
        })
        .then((data) => {
            console.log(data);
            if(data.message === 'ok'){
                newCardElement.remove();
                const oldData = getLocalStorageData('cats');
                const newData = oldData.filter(item => item.id !== dataCat.id);
                setLocalStorageData('cats', newData);
            }
        })
    }
    
    cardButtonEdit.addEventListener('click', handleClickCatEdit)
    cardButtonDelete.addEventListener('click', handleClickButtonDelete)
    cardImage.addEventListener('click', handleClickCatImage)

    return newCardElement;
    //    cardListContainer.append(newCardElement);

}

function cardAddToContainer(elementNode, container) {
    container.append(elementNode)
}

function getCats(){
    fetch('https://sb-cats.herokuapp.com/api/show')
    .then((response) => {
        if(response.ok) {
            return response.json();
        }   
        return Promise.reject(response)
    })
    .then(({data}) => {
        localStorage.setItem('cats', JSON.stringify(data))
        data.forEach(dataCat => cardAddToContainer(createCardCat(dataCat), cardListContainer))
    })
    .catch(err => {
        console.log(err);
    })

}

function handleClickButtonAdd(){
    openPopup(popupAddCats)
}

console.log(formAdd.elements);


formAdd.addEventListener('submit', (evt)=> {
    evt.preventDefault();
    const bodyJSON = formSerialize(formAdd)

    fetch('https://sb-cats.herokuapp.com/api/add', {
        method: 'POST',
        body: JSON.stringify(bodyJSON),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then((response) => {
        if(response.ok) {
            return response.json();
        }   
        return Promise.reject(response)
    })
    .then((data) => {
        if(data.message === 'ok'){
            reloadData();
            closePopup();
        }
        // cardAddToContainer(createCardCat(data), cardListContainer);
    })
    .catch(err => {
        console.log(err);
    })
})

function reloadData() {
    localStorage.clear();
    cardListContainer.innerHTML = "";
    getCats()
}

buttonAddCat.addEventListener('click', handleClickButtonAdd)
rootPopup.addEventListener('click', handleClickCloseBtn);
buttonReloadData.addEventListener('click', reloadData)


// if(localStorage.getItem('cats')){


//     // заменить.forEach(dataCat => cardAddToContainer(createCardCat(dataCat), cardListContainer));
// } else {
//     getCats();
// }


getCats();

// catImages.forEach(image => {
//     image.addEventListener('click', handleClickCatImage)
// })