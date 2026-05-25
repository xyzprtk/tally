from fastapi import APIRouter, HTTPException, Request

from services import dataset, llm
from sandbox import executor
from utils import code_parser
from models.schemas import ChatRequest, ChatResponse

router = APIRouter()


@router.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, request: Request):
    df = dataset.get_dataset()
    theme = request.headers.get("x-theme", "dark")

    messages = llm.build_messages(req.messages, df)

    try:
        llm_response = await llm.call_llm(messages, req.provider, req.api_key)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM call failed: {str(e)}")

    code = code_parser.extract_code_block(llm_response)

    if code is None:
        return ChatResponse(response=llm_response, result=None, error=None)

    result = await executor.execute_code(code, df, theme=theme)

    error = result.get("error")
    result_data = None
    if not error:
        result_data = {"type": result["type"], "data": result["data"]}
        if result.get("text"):
            llm_response += "\n\n" + result["text"]

    return ChatResponse(response=llm_response, result=result_data, error=error)
