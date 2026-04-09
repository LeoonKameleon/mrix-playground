import docker
from time import perf_counter
from docker.errors import APIError, ImageNotFound
from requests.exceptions import ReadTimeout, ConnectionError

client = docker.from_env()

def execute_code(code, timeout=30):
    start_time = perf_counter()
    container = None
    try:
        container = client.containers.run(
            image="mrix_interpreter",
            command=["-c", code],
            remove=False,
            stderr=True,
            stdout=True,
            mem_limit="128m",
            nano_cpus=500000000,
            network_disabled=True,
            detach=True
        )
        try:
            res = container.wait(timeout=timeout)
            status = res["StatusCode"]
        except (ReadTimeout, ConnectionError): # docker-py sometimes throws a ConnectionError on wait
            container.kill()
            status = 124
        except APIError as e:
            status = -1
            output = f"Docker API Error during wait: {str(e)}"
        if status != -1 or not output:
            output = container.logs().decode("utf-8")
    except ImageNotFound:
        output = "Internal Error: Interpreter image not found."
        status = -1
    except APIError as e:
        output = f"Docker API Error during run: {e.explanation}"
        status = -1
    except Exception as e:
        output = f"Unexpected system error: {str(e)}"
        status = -1
    finally:
        if container:
            try:
                container.remove(force=True)
            except:
                pass
    execution_time = perf_counter() - start_time
    return {
        "output": output,
        "status": status,
        "execution_time": round(execution_time, 5)
    }