<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>APDOC</title>
    <style>
        body {
            background: #18181b;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            padding: 0;
            margin: 0;
        }
        .body {
            background: #18181b;
            height: 800px;
        }
        .container {
            /* display: flex; */
            /* flex-direction: column; */
            justify-content: center;
            padding: 0 16px;
        }
        .logo {
            color: #34d399;
            font-weight: bold;
            font-size: 52px;
            margin: 52px auto 32px;
        }
        h1, p {
            color: white;
            margin: auto;
            padding-top: 16px;
            max-width: 580px;
            text-align: center;
        }
        h1 {
            padding-bottom: 32px;
        }
        p {
            color: #71717a;
        }
        .btn ,.btn a {
            text-decoration: none;
            background-color: #34d399;
            color: #18181b;
            margin: auto;
            border-radius: 6px;
            font-weight: bold;
        }
        .btn {
            display: flex;
            flex-direction: column;
            width: 180px;
            padding: 10px 20px;
        }
        .btntext {
            font-size: 16px;
            color: #18181b;
        }
        .link {
            margin: 52px auto;
        }
        .linkverify {
            text-decoration: none;
            color: #0d9488;
        }
        .mainsvg {
            display: flex;
            margin: auto;
            align-items: center;
            /* padding: 16px; */
        }
        .bar {
            background-color: #34d399;
            height: 64px;
        }
        #table-data {
            border-collapse: collapse;
            width: 60%;
            padding: 10px 20px;
            margin-bottom: 2rem;
        }
        #table-data thead{
            text-align: center;
            background-color: #34d399;
            text-transform: uppercase;
        }
        #table-data tbody{
            text-align: center;
            color: white;
            text-transform: capitalize;
        }
        #table-data td, #table-data th {
            border: 2px solid #34d399;
            padding: 8px;
        }

        #table-data tr:nth-child(even){background-color: #f2f2f2;}

        #table-data tr:hover {background-color: #ddd; color:#18181b; }

        #table-data th {
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: left;
            background-color: #04AA6D;
            color: white;
        }
    </style>
</head>
<body>
    <div class="body">
        <div class="bar"></div>
        <div class="container body">
            <h1 class="logo">APDOC</h1>
            <img src="https://i.postimg.cc/tJs5fwmH/email-8697-1.png" alt="email" width="128" class="mainsvg">
            <h1>Stok Item on your Clinic is low</h1>
            <center>
                <table id="table-data">
                    <thead>
                    <tr>
                        <td>name</td>
                        <td>categories</td>
                        <td>stok</td>
                        <td>unit</td>
                        <td>manufacture</td>
                        <td>expired</td>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ( $data as $item)
                    <tr>
                        <td>{{$item->item?->name}}</td>
                        <td>{{$item->item?->categoryItem?->name}}</td>
                        <td>{{$item->stock}}</td>
                        <td>{{$item->item?->unit}}</td>
                        <td>{{$item->manufacturing}}</td>
                        <td>{{$item->expired}}</td>
                    </tr>
                    @endforeach
                    </tbody>
                </table>
            </center>
            <div class="btn">
                <a href="http://localhost:3000/dashboard/pharmacy/item" class="btntext">Detail</a>
            </div>
        </div>
    </div>
</body>
</html>