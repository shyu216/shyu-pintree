import json
from bs4 import BeautifulSoup

def html_to_json(html_content):

    # 不递归则标签处理很麻烦
    keys = set()


    def parse_element(element):
        if element.name == 'a':
            if element.text in keys:
                return None
            keys.add(element.text)
            return {
                'type': 'link',
                'addDate': element.get('add_date'),
                'lastModified': element.get('last_modified'),
                'title': element.text,
                'url': element.get('href'),
                'icon': element.get('icon')
            }
        elif element.name == 'h3':
            if element.text in keys:
                return None
            keys.add(element.text)
            children = [parse_element(child) for child in element.find_next_sibling('dl').p.find_all(['a', 'h3'])]
            children = [child for child in children if child is not None]
            return {
                'type': 'folder',
                'addDate': element.get('add_date'),
                'lastModified': element.get('last_modified'),
                'title': element.text,
                'children': children
            }
        return None

    soup = BeautifulSoup(html_content, 'html.parser')
    bookmarks = [parse_element(h3) for h3 in soup.find_all('h3')]
    bookmarks = [bookmark for bookmark in bookmarks if bookmark is not None]

    return json.dumps(bookmarks, ensure_ascii=False, indent=4)

# 从文件中读取HTML书签内容
with open('./json/bookmarks.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# 调用函数并打印结果
json_output = html_to_json(html_content)

with open('./json/pintree.json', 'w', encoding='utf-8') as f:
    f.write(json_output)