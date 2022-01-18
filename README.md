# Image resizing service

### Start

    yarn start

### Endpoint

    /api/images

### Query params

| Key      | Description                                    | Required |
| -------- | ---------------------------------------------- | -------- |
| fileName | Name of the image, must be in images directory | true     |
| width    | Desired width                                  | false    |
| height   | Desired height                                 | false    |

To resize, provide both width and height
