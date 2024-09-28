import json
from bs4 import BeautifulSoup

def html_to_json(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    bookmarks = []

    def parse_folder(folder):
        folder_data = {
            "type": "folder",
            "addDate": int(folder.h3.get('add_date', 0)) if folder.h3 else 0,
            "title": folder.h3.get_text() if folder.h3 else "Untitled Folder",
            "children": []
        }
        for child in folder.find_all(['dt', 'dl'], recursive=True):
            if child.name == 'dt':
                link = child.find('a')
                if link:
                    folder_data["children"].append({
                        "type": "link",
                        "addDate": int(link.get('add_date', 0)),
                        "title": link.get_text(),
                        "icon": link.get('icon', ''),
                        "url": link.get('href')
                    })
            elif child.name == 'dl':
                folder_data["children"].append(parse_folder(child))
        return folder_data

    for folder in soup.find_all('dl', recursive=False):
        bookmarks.append(parse_folder(folder))

    return json.dumps(bookmarks, indent=4)

# 从文件中读取HTML书签内容
with open('./bookmarks.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# 调用函数并打印结果
json_output = html_to_json(html_content)

with open('./bookmarks.json', 'w', encoding='utf-8') as f:
    f.write(json_output)