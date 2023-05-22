from fastapi import FastAPI, UploadFile, File
import uvicorn

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/api/image")
async def upload_files(files: list[UploadFile] = File(...)):
    try:
        for file in files:
            contents = await file.read()
            with open(file.filename, "wb") as f:
                f.write(contents)
        return {"message": "Files uploaded successfully"}
    except Exception as e:
        return {"message": "Error uploading files"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        reload=True,
        port=2000,
    )
