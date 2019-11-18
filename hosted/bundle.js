'use strict';

var handleItem = function handleItem(e) {
    e.preventDefault();

    $('#itemMessage').animate({ width: 'hide' }, 350);

    if ($('#itemName').val() == '' || $('#itemCost').val() == '' || $('#itemUrl').val() == '' || $('#itemWears').val() == '') {
        handleError('all fields required');
        return false;
    }

    sendAjax('POST', $('#itemForm').attr('action'), $('#itemForm').serialize(), function () {
        redirect({ redirect: '/maker' });
    });

    return false;
};

var handleItemUpdate = function handleItemUpdate(e) {
    e.preventDefault();

    $('#itemMessage').animate({ width: 'hide' }, 350);

    if ($('#itemName').val() == '' || $('#itemCost').val() == '' || $('#itemUrl').val() == '' || $('#itemWears').val() == '') {
        handleError('all fields required');
        return false;
    }

    sendAjax('POST', $('#itemForm').attr('action'), $('#itemForm').serialize(), function () {
        redirect({ redirect: '/maker' });
    });

    return false;
};

//update ze passworde
var handlePasswordChange = function handlePasswordChange(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("all fields required ya dweeb");
        return false;
    }
    if ($("#pass").val() != $("#pass2").val()) {
        handleError("passwords dont match!!! >:(");
        return false;
    }
    sendAjax('POST', $("#passwordChangeForm").attr("action"), $("#passwordChangeForm").serialize(), redirect);

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
        React.createElement('input', { className: 'makeItemSubmit', type: 'submit', value: 'Add' })
    );
};

var PasswordChange = function PasswordChange(props) {
    return React.createElement(
        'form',
        { id: 'passwordChangeForm', name: 'passwordChangeForm',
            onSubmit: handlePasswordChange,
            action: '/passwordChange',
            method: 'POST',
            className: 'mainForm' },
        React.createElement(
            'h3',
            { id: 'passChangeTitle' },
            'Change Password'
        ),
        React.createElement(
            'div',
            { id: 'passChangeFormInput' },
            React.createElement(
                'div',
                { id: 'oldPassContainer' },
                React.createElement(
                    'h5',
                    null,
                    'Current Password:'
                ),
                React.createElement('input', { id: 'oldPass', type: 'password', name: 'oldPass', placeholder: 'password' })
            ),
            React.createElement(
                'div',
                { id: 'newPassContainer1' },
                React.createElement(
                    'h5',
                    null,
                    'New Password:'
                ),
                React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'password' })
            ),
            React.createElement(
                'div',
                { id: 'newPassContainer2' },
                React.createElement(
                    'h5',
                    null,
                    'Confirm New Password:'
                ),
                React.createElement('input', { id: 'pass2', type: 'password', name: 'pass2', placeholder: 'confirm password' })
            )
        ),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { id: 'changePassButton', className: 'formSubmit', type: 'submit', value: 'Change Password' })
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
            { key: item._id, className: 'item', onClick: function onClick() {
                    ReactDOM.render(React.createElement(Item, { csrf: props.csrf, item: item }), document.querySelector('#items'));
                } },
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

var Item = function Item(props) {
    return React.createElement(
        'div',
        { key: props.item._id, className: 'item' },
        React.createElement('img', { src: props.item.imageUrl, alt: 'item image', className: 'itemImage' }),
        React.createElement(
            'h3',
            { className: 'itemName' },
            'Name: ',
            props.item.name
        ),
        React.createElement(
            'h3',
            { className: 'itemCost' },
            'Cost: ',
            props.item.cost
        ),
        React.createElement(
            'h3',
            { className: 'itemWears' },
            'Wears: ',
            props.item.wears
        ),
        React.createElement(
            'form',
            { id: 'itemForm',
                onSubmit: handleItemUpdate,
                name: 'itemForm',
                action: '/updateItem',
                method: 'POST',
                className: 'itemForm' },
            React.createElement(
                'label',
                { htmlFor: 'name' },
                'Name: '
            ),
            React.createElement('input', { id: 'itemName', type: 'text', name: 'name', placeholder: 'Item Name', defaultValue: props.item.name }),
            React.createElement(
                'label',
                { htmlFor: 'cost' },
                'Cost: '
            ),
            React.createElement('input', { id: 'itemCost', type: 'number', name: 'cost', placeholder: 'Item Cost', defaultValue: props.item.cost }),
            React.createElement(
                'label',
                { htmlFor: 'itemUrl' },
                'Image URL: '
            ),
            React.createElement('input', { id: 'itemUrl', type: 'text', name: 'itemUrl', placeholder: 'Item URL', defaultValue: props.item.imageUrl }),
            React.createElement(
                'label',
                { htmlFor: 'wears' },
                'Wears: '
            ),
            React.createElement('input', { id: 'itemWears', type: 'number', name: 'wears', placeholder: 'Number of Wears', defaultValue: props.item.wears }),
            React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
            React.createElement('input', { type: 'hidden', name: '_id', value: props.item._id }),
            React.createElement('input', { className: 'makeItemSubmit', type: 'submit', value: 'Update Item' })
        )
    );
};

var loadItemsFromServer = function loadItemsFromServer(csrf) {
    sendAjax('GET', '/getItems', null, function (data) {
        ReactDOM.render(React.createElement(ItemList, { items: data.items, csrf: csrf }), document.querySelector('#items'));
    });
};

var setup = function setup(csrf) {
    document.querySelector("#passChange").addEventListener("click", function (e) {
        e.preventDefault();
        ReactDOM.render(React.createElement(PasswordChange, { csrf: csrf }), document.querySelector("#items"));
        return false;
    });

    document.querySelector("#addItem").addEventListener("click", function (e) {
        e.preventDefault();
        ReactDOM.render(React.createElement(ItemForm, { csrf: csrf }), document.querySelector('#items'));
        return false;
    });

    ReactDOM.render(React.createElement(ItemForm, { csrf: csrf }), document.querySelector('#items'));

    ReactDOM.render(React.createElement(ItemList, { items: [] }), document.querySelector('#items'));

    loadItemsFromServer(csrf);
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
