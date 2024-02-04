# DevExtreme dxDataGrid CRUD Example

This repository contains a complete example showcasing the use of DevExtreme's dxDataGrid for jQuery. The example covers the following key features:

- **C**reate row
- **R**eorder rows with drag and drop
- **U**pdate row
- **D**elete row

## Features

- **Row Reordering:** Easily reorder rows using drag-and-drop functionality.
- **Add Row:** Demonstration of adding new rows to the dxDataGrid.
- **Update Row:** Illustration of updating existing row data.
- **Delete Row:** Example of deleting rows from the grid.

## Getting Started

1. Clone this repository:

```bash
git clone https://github.com/burakbasaranb/DevExtreme-dxDataGrid-CRUD-and-Row-Reordering-Example.git
```
2. Open the `index.html` file in your web browser.

3. Explore the functionalities of the dxDataGrid with drag-and-drop row reordering, adding, updating, and deleting rows.

## Technologies Used

- DevExtreme jQuery
- HTML5
- CSS3
- JavaScript

## Feedback and Contributions

Feel free to open an issue for any questions, feedback, or suggestions. Contributions are welcome!

## License

Please refer to [DevExtreme Licensing](https://js.devexpress.com/Licensing/)

## Security

Please refer to [DevExpress Security Policy](https://github.com/DevExpress/Shared/security/policy)

## Code Desription

- **`index.html`:** Entry point for the application. The HTML file where the application starts. It may include the structure of the page, reference to CSS styles, and scripts.

- **`data.js`:** DataSource for the dxDataGrid. This file likely contains sample data or logic to fetch data for the grid.

- **`style.css`:** Stylesheet file that controls the visual appearance of the application. It defines the styling for various elements within the HTML.

- **`index.js`:** Main JavaScript file for the application. It may include the initialization of the dxDataGrid, event handlers, and any other logic required for the functionality of the application.

### Editing Forms

The `editing` option in the DevExpress DataGrid widget. This configuration determines how users can edit the data in the grid.

```javascript
editing: {
      mode: "popup",
      useIcons: true,
      allowUpdating: true,
      allowDeleting: true,
      allowAdding: true,
    },
```

### ReOrder

The `rowDragging` option in the DevExpress DataGrid widget allows you to enable and configure row reordering within the grid.

Here's a basic example of how it can be used:


```javascript
rowDragging: {
      allowReordering: true,
      onReorder(e) {
        const visibleRows = e.component.getVisibleRows();
        const toIndex = tasks.findIndex((item) => item.ID === visibleRows[e.toIndex].data.ID);
        const fromIndex = tasks.findIndex((item) => item.ID === e.itemData.ID);

        tasks.splice(fromIndex, 1);
        tasks.splice(toIndex, 0, e.itemData);

        // 1. refresh the list with new order
        e.component.refresh();
        
        //-----------------------------------------
        // 2. Then send the new order to the server
        
        // Create IDs array
        var newOrder = [];
        for (var i = 0; i < tasks.length; i++) {
            newOrder.push(tasks[i].ID);
        }
        //send IDs to server
        setRowOrders(newOrder.join());
        //-----------------------------------------
      },
    },
```

In this example, when a row is dragged and dropped, the onReorder function is called. This function updates the tasks array to reflect the new order of the rows and then refreshes the grid.
