export function saveLayout(layout) {
  // convert the layout array to a JSON string
  const data = JSON.stringify(layout, null, 2);

  // create a Blob object from the data
  const blob = new Blob([data], {type: 'application/json'});

  // create a URL for the Blob object
  const url = URL.createObjectURL(blob);

  // create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = 'data.json';

  document.body.appendChild(link);

  link.click();

  // remove the link from the body
  document.body.removeChild(link);
}
