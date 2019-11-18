'use strict';

var handleItem = function handleItem(e) {
    e.preventDefault();

    $('#itemMessage').animate({ width: 'hide' }, 350);

    if ($('#itemName').val() == '' || $('#itemCost').val() == '' || $('#itemUrl').val() == '' || $('#itemWears').val() == '') {
        handleError('all fields required');
        return false;
    }

    sendAjax('POST', $('#itemForm').attr('action'), $('#itemForm').serialize(), function () {
        loadItemsFromServer();
    });

    return false;
};

var ItemForm = function ItemForm(props) {
    return React.createElement(
        'form',
        { id: 'itemForm',
            onSubmit: handleItem,
            name: 'itemForm',
            action: '/maker',
            method: 'POST',
            className: 'itemForm' },
        React.createElement(
            'label',
            { htmlFor: 'name' },
            'Name: '
        ),
        React.createElement('input', { id: 'itemName', type: 'text', name: 'name', placholder: 'Item Name' }),
        React.createElement(
            'label',
            { htmlFor: 'cost' },
            'Cost: '
        ),
        React.createElement('input', { id: 'itemCost', type: 'number', name: 'cost', placeholder: 'Item Cost' }),
        React.createElement(
            'label',
            { htmlFor: 'itemUrl' },
            'Image URL: '
        ),
        React.createElement('input', { id: 'itemUrl', type: 'text', name: 'itemUrl', placeholder: 'Item URL' }),
        React.createElement(
            'label',
            { htmlFor: 'wears' },
            'Wears: '
        ),
        React.createElement('input', { id: 'itemWears', type: 'number', name: 'wears', placeholder: 'Number of Wears' }),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'makeItemSubmit', type: 'submit', value: 'Make Item' })
    );
};

var ItemList = function ItemList(props) {
    if (props.items.length === 0) {
        return React.createElement(
            'div',
            { className: 'itemList' },
            React.createElement(
                'h3',
                { className: 'emptyItem' },
                'No Items yet'
            )
        );
    }

    //img src should be pulled frm DB
    var itemNodes = props.items.map(function (item) {
        return React.createElement(
            'div',
            { key: item._id, className: 'item' },
            React.createElement('img', { src: item.imageUrl, alt: 'item image', className: 'itemImage' }),
            React.createElement(
                'h3',
                { className: 'itemName' },
                'Name: ',
                item.name
            ),
            React.createElement(
                'h3',
                { className: 'itemCost' },
                'Cost: ',
                item.cost
            ),
            React.createElement(
                'h3',
                { className: 'itemWears' },
                'Wears: ',
                item.wears
            )
        );
    });

    return React.createElement(
        'div',
        { className: 'itemList' },
        itemNodes
    );
};

var loadItemsFromServer = function loadItemsFromServer() {
    sendAjax('GET', '/getItems', null, function (data) {
        ReactDOM.render(React.createElement(ItemList, { items: data.items }), document.querySelector('#items'));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(ItemForm, { csrf: csrf }), document.querySelector('#makeItem'));

    ReactDOM.render(React.createElement(ItemList, { items: [] }), document.querySelector('#items'));

    loadItemsFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
'use strict';

var handleError = function handleError(message) {
    $('#errorMessage').text(message);
    $('#domoMessage').animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $('#domoMessage').animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
