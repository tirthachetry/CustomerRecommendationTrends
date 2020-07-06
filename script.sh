To Import data:

mongoimport --db fashion --collection zappos-us_product --file /Users/vishatha/Downloads/fashion/zappos-us_product.json

To export data in required format :

mongoexport --db fashion --collection zappos-us_product --fields "meta,title,brand,size,category,description,gender,color_slug,mrp,thumbnail,stock" --out zappos-us_product_cleanData.csv
 
 Solr command to upload data :
./solr start -e
./solr start -e cloud
./post -c zappos-us_product -p 7575 /Users/vishatha/zappos-us_product_cleanData2.json

Solr Query example :
http://10.105.24.217:7574/solr/zappos-us_product/select?q=(((title%3Ablack%20)and%20(title%3A%20shirt))%5E%3D5)%20or%20(((description%20%3A%20black)%20and%20(description%20%3A%20shirt%20))%5E%3D4)%20or%20((brand%3ARobert%20Graham)%5E%3D2)%20or%20((gender%20%3A%20men)%20or%20(color_slug%20%3A%20black))%5E%3D6&rows=10&sort=score%20desc