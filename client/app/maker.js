const handleItem = (e) => {
    e.preventDefault();

    $('#itemMessage').animate({ width: 'hide' }, 350);

    if ($('#itemName').val() == '' || $('#itemCost').val() == '') {
        handleError('all fields required');
        return false;
    }

    sendAjax('POST', $('#itemForm').attr('action'), $('#itemForm').serialize(), function () {
        loadItemsFromServer();
    });

    return false;
}

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
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeItemSubmit" type="submit" value="Make Item" />
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
            <div key={item._id} className="item">
            
                <img src={item.imageUrl} alt="item image" className="itemImage" />
                <h3 className="itemName">Name: {item.name}</h3>
                <h3 className="itemCost">Cost: {item.age}</h3>
                <h3 className="itemWears">Cost: {item.wears}</h3>
            </div>
        );
    });

    return (
        <div className="itemList">
            {itemNodes}
        </div>
    );
};

const loadItemsFromServer = () => {
    sendAjax('GET', '/getItems', null, (data) => {
        ReactDOM.render(
            <ItemList items={data.items} />, document.querySelector('#items')
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <ItemForm csrf={csrf} />, document.querySelector('#makeItem')
    );

    ReactDOM.render(
        <ItemList items={[]} /> ,document.querySelector('#items')
    );

    loadItemsFromServer();
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});

