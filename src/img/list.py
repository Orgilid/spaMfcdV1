import os

# Зураг хадгалагдсан зам
image_dir = r'E:\appAfaci\mfcdb\dist\img\foods'

# Бүх JPG файлыг цуглуулах
image_files = [
    os.path.join(image_dir, f).replace("\\", "/")
    for f in os.listdir(image_dir)
    if f.lower().endswith('.jpg')
]

# JavaScript массив хэлбэрээр хэвлэх
print("const allImages = [")
for img in image_files:
    print(f'  "{img}",')
print("];")
