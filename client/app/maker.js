const handleItem = (e) => {
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
}

const handleItemUpdate = (e) => {
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
}

//update ze passworde
const handlePasswordChange = (e) => {
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

const ItemForm = (props) => {
    return (
        <form id="itemForm"
            onSubmit={handleItem}
            name="itemForm"
            action="/maker"
            method="POST"
            className="itemForm">
            <label htmlFor="name">Name: </label>
            <input id="itemName" type="text" name="name" placholder="Item Name" />
            <label htmlFor="cost">Cost: </label>
            <input id="itemCost" type="number" name="cost" placeholder="Item Cost" />
            <label htmlFor="itemUrl">Image URL: </label>
            <input id="itemUrl" type="text" name="itemUrl" placeholder="Item URL" />
            <label htmlFor="wears">Wears: </label>
            <input id="itemWears" type="number" name="wears" placeholder="Number of Wears" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeItemSubmit" type="submit" value="Make Item" />
        </form>
    );
};

const PasswordChange = (props) => {
    return (
        <form id="passwordChangeForm" name="passwordChangeForm"
            onSubmit={handlePasswordChange}
            action="/passwordChange"
            method="POST"
            className="mainForm">
                
            <h3 id="passChangeTitle">Change Password</h3>
            <div id="passChangeFormInput">
                <div id="oldPassContainer">
                    <h5>Current Password:</h5>
                    <input id="oldPass" type="password" name="oldPass" placeholder="password" />
                </div>
                <div id="newPassContainer1">
                    <h5>New Password:</h5>
                    <input id="pass" type="password" name="pass" placeholder="password" />
                </div>
                <div id="newPassContainer2">
                    <h5>Confirm New Password:</h5>
                    <input id="pass2" type="password" name="pass2" placeholder="confirm password" />
                </div>
            </div>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input id="changePassButton" className="formSubmit" type="submit" value="Change Password" />
        </form>
    );
};

const ItemList = function (props) {
    if (props.items.length === 0) {
        return (
            <div className="itemList">
                <h3 className="emptyItem">No Items yet</h3>
            </div>
        )
    }

    //img src should be pulled frm DB
    const itemNodes = props.items.map(function (item) {
        return (
            <div key={item._id} className="item" onClick={() => { ReactDOM.render(<Item csrf={props.csrf} item={item} />, document.querySelector('#items')) }}>

                <img src={item.imageUrl} alt="item image" className="itemImage" />
                <h3 className="itemName">Name: {item.name}</h3>
                <h3 className="itemCost">Cost: {item.cost}</h3>
                <h3 className="itemWears">Wears: {item.wears}</h3>
            </div>
        );
    });

    return (
        <div className="itemList">
            {itemNodes}
        </div>
    );
};

const Item = function (props) {
    return (
        <div key={props.item._id} className="item">

            <img src={props.item.imageUrl} alt="item image" className="itemImage" />
            <h3 className="itemName">Name: {props.item.name}</h3>
            <h3 className="itemCost">Cost: {props.item.cost}</h3>
            <h3 className="itemWears">Wears: {props.item.wears}</h3>

            <form id="itemForm"
                onSubmit={handleItemUpdate}
                name="itemForm"
                action="/updateItem"
                method="POST"
                className="itemForm">
                <label htmlFor="name">Name: </label>
                <input id="itemName" type="text" name="name" placeholder="Item Name" defaultValue={props.item.name} />
                <label htmlFor="cost">Cost: </label>
                <input id="itemCost" type="number" name="cost" placeholder="Item Cost" defaultValue={props.item.cost} />
                <label htmlFor="itemUrl">Image URL: </label>
                <input id="itemUrl" type="text" name="itemUrl" placeholder="Item URL" defaultValue={props.item.imageUrl} />
                <label htmlFor="wears">Wears: </label>
                <input id="itemWears" type="number" name="wears" placeholder="Number of Wears" defaultValue={props.item.wears} />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input type="hidden" name="_id" value={props.item._id} />
                <input className="makeItemSubmit" type="submit" value="Update Item" />
            </form>
        </div>
    );
};

const loadItemsFromServer = (csrf) => {
    sendAjax('GET', '/getItems', null, (data) => {
        ReactDOM.render(
            <ItemList items={data.items} csrf={csrf} />, document.querySelector('#items')
        );
    });
};

const setup = function (csrf) {
    document.querySelector("#passChange").addEventListener("click", (e) => {
        e.preventDefault();
        ReactDOM.render(
            <PasswordChange csrf={csrf} />, document.querySelector("#items")
        );
        return false;
    });

    document.querySelector("#addItem").addEventListener("click", (e) => {
        e.preventDefault();
        ReactDOM.render(
            <ItemForm csrf={csrf} />, document.querySelector('#items')
        );
        return false;
    });

    ReactDOM.render(
        <ItemForm csrf={csrf} />, document.querySelector('#items')
    );

    ReactDOM.render(
        <ItemList items={[]} />, document.querySelector('#items')
    );

    loadItemsFromServer(csrf);
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});

