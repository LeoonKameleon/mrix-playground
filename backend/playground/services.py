import docker

client = docker.from_env()

def execute_code(code):
    output = client.containers.run(
        image="mrix_interpreter",
        command=["-c", code],
        remove=True,
        stderr=True,
        stdout=True,
        mem_limit="128m",
        nano_cpus=500000000,
        network_disabled=True,
    )
    return output.decode("utf-8")