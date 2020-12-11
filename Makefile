# Makefile for building litmus-e2e
# Reference Guide - https://www.gnu.org/software/make/manual/make.html

IS_DOCKER_INSTALLED = $(shell which docker >> /dev/null 2>&1; echo $$?)

# export all the dependent variables
EXPORT_VARIABLES = $(shell echo "export CI_JOB_ID=${CI_JOB_ID} && export CI_PIPELINE_ID=${CI_PIPELINE_ID} && export GITHUB_TOKEN=${GITHUB_TOKEN} && \
export CGO_ENABLED=${CGO_ENABLED} && export ANSIBLE_EXPERIMENT_IMAGE=${ANSIBLE_EXPERIMENT_IMAGE} && export GO_EXPERIMENT_IMAGE=${GO_EXPERIMENT_IMAGE} && \
export OPERATOR_IMAGE=${OPERATOR_IMAGE} && export RUNNER_IMAGE=${RUNNER_IMAGE} && export OPERATOR_NAME=${OPERATOR_NAME} && export CHAOS_NAMESPACE=${CHAOS_NAMESPACE} && \
export APP_NS=${APP_NS} && export APP_LABEL=${APP_LABEL} && export JOB_CLEANUP_POLICY=${JOB_CLEANUP_POLICY} && export ANNOTATION_CHECK=${ANNOTATION_CHECK} && \
export APPLICATION_NODE_NAME=${APPLICATION_NODE_NAME} && export IMAGE_PULL_POLICY=${IMAGE_PULL_POLICY} && export TOTAL_CHAOS_DURATION=${TOTAL_CHAOS_DURATION} && \
export RBAC_PATH=${RBAC_PATH} && export EXPERIMENT_PATH=${EXPERIMENT_PATH} && export ENGINE_PATH=${ENGINE_PATH} && export ANSIBLE_RBAC_PATH=${ANSIBLE_RBAC_PATH} && \
export ANSIBLE_EXPERIMENT_PATH=${ANSIBLE_EXPERIMENT_PATH} && export ANSIBLE_ENGINE_PATH=${ANSIBLE_ENGINE_PATH} && export INSTALL_LITMUS=${INSTALL_LITMUS} && export ADMIN_RBAC_PATH=${ADMIN_RBAC_PATH}")

# docker info
DOCKER_REPO ?= litmuschaos
DOCKER_IMAGE ?= litmus-e2e
DOCKER_TAG ?= ci

TESTPATH ?= /home/udit/go/src/github.com/litmuschaos/litmus-e2e


.PHONY: build-litmus
build-litmus:

	@echo "------------"
	@echo "Build Litmus"
	@echo "------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
	 "$(EXPORT_VARIABLES) && go test $(TESTPATH)/tests/install-litmus_test.go -v -count=1"

.PHONY: build-litmus
build-litmus:

	@echo "-------------------------------------"
	@echo "Build Litmus For Pod Level Chaos test"
	@echo "-------------------------------------"
	@go test tests/install-litmus_test.go -v -count=1

.PHONY: app-deploy
app-deploy:

	@echo "---------------------"
	@echo "Deploying Application"
	@echo "---------------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
	 "$(EXPORT_VARIABLES)  && go test $(TESTPATH)/tests/app-deploy_test.go -v -count=1"

.PHONY: app-deploy
app-deploy:

	@echo "----------------------------------------"
	@echo "Deploying Application For pod level test"
	@echo "----------------------------------------"
	@go test tests/app-deploy_test.go -v -count=1

.PHONY: liveness
liveness:

	@echo "---------------------"
	@echo "Deploying Application"
	@echo "---------------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
     "$(EXPORT_VARIABLES)  && go test $(TESTPATH)/tests/app-liveness_test.go -v -count=1"

.PHONY: liveness
liveness:

	@echo "----------------------------------------"
	@echo "Deploying Application For Pod level test"
	@echo "----------------------------------------"
	@go test tests/app-liveness_test.go -v -count=1

.PHONY: auxiliary-app
auxiliary-app:

	@echo "-----------------------"
	@echo "Deploying Auxiliary App"
	@echo "-----------------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
	 "$(EXPORT_VARIABLES)  && go test $(TESTPATH)/tests/auxiliary-app_test.go -v -count=1"

.PHONY: auxiliary-app
auxiliary-app:

	@echo "-----------------------"
	@echo "Deploying Auxiliary App"
	@echo "-----------------------"
	@go test tests/auxiliary-app_test.go -v -count=1	 

.PHONY: pod-delete
pod-delete:

	@echo "-------------------------------"
	@echo "Running pod-delete experiment"
	@echo "--------------------------------"
	@go test tests/pod-delete_test.go -v -count=1

.PHONY: container-kill
container-kill:

	@echo "-------------------------------"
	@echo "Running container-kill experiment"
	@echo "--------------------------------"
	@go test tests/container-kill_test.go -v -count=1

.PHONY: pod-network-latency
pod-network-latency:

	@echo "--------------------------------------"
	@echo "Running pod-network-latency experiment"
	@echo "--------------------------------------"
	@go test tests/pod-network-latency_test.go -v -count=1

.PHONY: pod-network-loss
pod-network-loss:

	@echo "-----------------------------------"
	@echo "Running pod-network-loss experiment"
	@echo "-----------------------------------"
	@go test tests/pod-network-loss_test.go -v -count=1


.PHONY: pod-network-corruption
pod-network-corruption:

	@echo "-------------------------------"
	@echo "Running pod-network-corruption experiment"
	@echo "--------------------------------"
	@go test tests/pod-network-corruption_test.go -v -count=1

.PHONY: pod-cpu-hog
pod-cpu-hog:

	@echo "-------------------------------"
	@echo "Running pod-cpu-hog experiment"
	@echo "--------------------------------"
	@go test tests/pod-cpu-hog_test.go -v -count=1

.PHONY: node-cpu-hog
node-cpu-hog:

	@echo "-------------------------------"
	@echo "Running node-cpu-hog experiment"
	@echo "--------------------------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
	"$(EXPORT_VARIABLES)  && go test $(TESTPATH)/tests/node-cpu-hog_test.go -v -count=1"

.PHONY: node-drain
node-drain:

	@echo "---------------------------------"
	@echo "Running node-drain experiment"
	@echo "---------------------------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
	"$(EXPORT_VARIABLES)  && go test $(TESTPATH)/tests/node-drain_test.go -v -count=1"

.PHONY: disk-fill
disk-fill:

	@echo "--------------------------------"
	@echo "Running disk-fill experiment"
	@echo "--------------------------------"
	@go test tests/disk-fill_test.go -v -count=1

.PHONY: node-memory-hog
node-memory-hog:

	@echo "----------------------------------"
	@echo "Running node-memory-hog experiment"
	@echo "----------------------------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
	"$(EXPORT_VARIABLES)  && go test $(TESTPATH)/tests/node-memory-hog_test.go -v -count=1"

.PHONY: pod-memory-hog
pod-memory-hog:

	@echo "---------------------------------"
	@echo "Running pod-memory-hog experiment"
	@echo "---------------------------------"
	@go test tests/pod-memory-hog_test.go -v -count=1

.PHONY: kubelet-service-kill
kubelet-service-kill:

	@echo "---------------------------------------"
	@echo "Running kubelet-service-kill experiment"
	@echo "---------------------------------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
	"$(EXPORT_VARIABLES)  && go test $(TESTPATH)/tests/kubelet-service-kill_test.go -v -count=1"

.PHONY: node-taint
node-taint:

	@echo "---------------------------------------"
	@echo "Running node-taint experiment"
	@echo "---------------------------------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
	"$(EXPORT_VARIABLES)  && go test $(TESTPATH)/tests/node-taint_test.go -v -count=1"

.PHONY: pod-network-duplication
pod-network-duplication:

	@echo "------------------------------------------"
	@echo "Running pod-network-duplication experiment"
	@echo "------------------------------------------"
	@go test tests/pod-network-duplication_test.go -v -count=1

.PHONY: pod-autoscaler
pod-autoscaler:

	@echo "------------------------------------------"
	@echo "Running pod-autoscaler experiment"
	@echo "------------------------------------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
	"$(EXPORT_VARIABLES)  && go test $(TESTPATH)/tests/pod-autoscaler_test.go -v -count=1"	
	
.PHONY: pod-io-stress
pod-io-stress:

	@echo "------------------------------------------"
	@echo "Running pod-io-stress experiment"
	@echo "------------------------------------------"
	@go test tests/pod-io-stress_test.go -v -count=1	

.PHONY: node-io-stress
node-io-stress:

	@echo "------------------------------------------"
	@echo "Running node-io-stress experiment"
	@echo "------------------------------------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
	"$(EXPORT_VARIABLES)  && go test $(TESTPATH)/tests/node-io-stress_test.go -v -count=1"		

.PHONY: operator-reconcile-resiliency-check
 operator-reconcile-resiliency-check:

	@echo "--------------------------------------------"
	@echo "Running  Operator Reconcile Resiliency Check"
	@echo "--------------------------------------------"
	@go test operator/reconcile-resiliency_test.go -v -count=1

.PHONY: admin-mode-check
admin-mode-check:

	@echo "------------------------"
	@echo "Running Admin Mode Check"
	@echo "------------------------"
	@go test operator/admin-mode_test.go -v -count=1	


.PHONY: e2e-metrics
e2e-metrics:

	@echo "----------------------------"
	@echo "Pipeline Coverage Percentage"
	@echo "----------------------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
	 "$(EXPORT_VARIABLES) && cd $(TESTPATH) && bash metrics/e2e-metrics"

.PHONY: app-cleanup
app-cleanup:

	@echo "--------------------"
	@echo "Deleting litmus"
	@echo "--------------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
	 "$(EXPORT_VARIABLES)  && go test $(TESTPATH)/tests/litmus-cleanup_test.go -v -count=1"

.PHONY: app-cleanup
app-cleanup:

	@echo "--------------------"
	@echo "Deleting litmus From Cluster 1"
	@echo "--------------------"
	@go test tests/litmus-cleanup_test.go -v -count=1

.PHONY: pipeline-status-update
pipeline-status-update:

	@echo "------------------------"
	@echo "Updating Pipeline Status"
	@echo "------------------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
	 "$(EXPORT_VARIABLES)  && go test $(TESTPATH)/tests/pipeline-update_test.go -v -count=1"

.PHONY: deps
deps: _build_check_docker godeps docker-build

_build_check_docker:
	@if [ $(IS_DOCKER_INSTALLED) -eq 1 ]; \
		then echo "" \
		&& echo "ERROR:\tdocker is not installed. Please install it before build." \
		&& echo "" \
		&& exit 1; \
		fi;

godeps:
	@echo "INFO:\tverifying dependencies for litmus-e2e build ..."
	@go get -u -v golang.org/x/lint/golint
	@go get -u -v golang.org/x/tools/cmd/goimports

docker-build: 
	@echo "----------------------------"
	@echo "--> Build litmus-e2e image" 
	@echo "----------------------------"
	# Dockerfile available in the repo root
	sudo docker build . -f Dockerfile -t $(DOCKER_REPO)/$(DOCKER_IMAGE):$(DOCKER_TAG)

.PHONY: push
push: docker-push

docker-push:
	@echo "---------------------------"
	@echo "--> Push litmus-e2e image" 
	@echo "---------------------------"
	REPONAME="$(DOCKER_REPO)" IMGNAME="$(DOCKER_IMAGE)" IMGTAG="$(DOCKER_TAG)" ./build/push	 
	 
#################################################################################
#################            Ansible Experiment BDDS            #################
#################################################################################

.PHONY: ansible-pod-delete
ansible-pod-delete:

	@echo "-------------------------------------"
	@echo "Running Ansible Pod Delete Experiment"
	@echo "-------------------------------------"
	@go test ansible/ansible-pod-delete_test.go -v -count=1

.PHONY: ansible-container-kill
ansible-container-kill:

	@echo "-------------------------------------"
	@echo "Running Ansible Container Kill Experiment"
	@echo "-------------------------------------"
	@go test ansible/ansible-container-kill_test.go -v -count=1

.PHONY: ansible-disk-fill
ansible-disk-fill:

	@echo "-------------------------------------"
	@echo "Running Ansible disk fill Experiment"
	@echo "-------------------------------------"
	@go test ansible/ansible-disk-fill_test.go -v -count=1

.PHONY: ansible-node-cpu-hog
ansible-node-cpu-hog:

	@echo "---------------------------------------"
	@echo "Running Ansible Node CPU Hog Experiment"
	@echo "---------------------------------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
	 "$(EXPORT_VARIABLES)  && go test $(TESTPATH)/ansible/ansible-node-cpu-hog_test.go -v -count=1"

.PHONY: ansible-node-memory-hog
ansible-node-memory-hog:

	@echo "------------------------------------------"
	@echo "Running Ansible Node Memory Hog Experiment"
	@echo "------------------------------------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
	 "$(EXPORT_VARIABLES)  && go test $(TESTPATH)/ansible/ansible-node-memory-hog_test.go -v -count=1"

.PHONY: ansible-pod-cpu-hog
ansible-pod-cpu-hog:

	@echo "--------------------------------------"
	@echo "Running Ansible Pod CPU Hog Experiment"
	@echo "--------------------------------------"
	@go test ansible/ansible-pod-cpu-hog_test.go -v -count=1

.PHONY: ansible-pod-memory-hog
ansible-pod-memory-hog:

	@echo "-----------------------------------------"
	@echo "Running Ansible Pod Memory Hog Experiment"
	@echo "-----------------------------------------"
	@go test ansible/ansible-pod-memory-hog_test.go -v -count=1

.PHONY: ansible-pod-network-corruption
ansible-pod-network-corruption:

	@echo "-------------------------------------------------"
	@echo "Running Ansible Pod Network Corruption Experiment"
	@echo "-------------------------------------------------"
	@go test ansible/ansible-pod-network-corruption_test.go -v -count=1

.PHONY: ansible-pod-network-latency
ansible-pod-network-latency:

	@echo "----------------------------------------------"
	@echo "Running Ansible Pod Network Latency Experiment"
	@echo "----------------------------------------------"
	@go test ansible/ansible-pod-network-latency_test.go -v -count=1


.PHONY: ansible-pod-network-loss
ansible-pod-network-loss:

	@echo "-------------------------------------------"
	@echo "Running Ansible Pod Network Loss Experiment"
	@echo "-------------------------------------------"
	@go test ansible/ansible-pod-network-loss_test.go -v -count=1


.PHONY: ansible-kubelet-service-kill
ansible-kubelet-service-kill:

	@echo "-----------------------------------------------"
	@echo "Running Ansible Kubelet Service Kill Experiment"
	@echo "-----------------------------------------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
	 "$(EXPORT_VARIABLES)  && go test $(TESTPATH)/ansible/ansible-kubelet-service-kill_test.go -v -count=1"


.PHONY: ansible-node-drain
ansible-node-drain:

	@echo "-------------------------------------"
	@echo "Running Ansible Node Drain Experiment"
	@echo "-------------------------------------"
	@sshpass -p ${litmus_pass} ssh -o StrictHostKeyChecking=no ${litmus_user}@${litmus_ip} -p ${port} -tt \
	 "$(EXPORT_VARIABLES)  && go test $(TESTPATH)/ansible/ansible-node-drain_test.go -v -count=1"	

######################
### NEGATIVE TESTS ###
######################

.PHONY: annotation-check
annotation-check:

	@echo "-----------------------------------------"
	@echo "Running Annotation Check For Chaos Engine"
	@echo "-----------------------------------------"
	@go test engine/annotation-check_test.go -v -count=1


.PHONY: appinfo
appinfo:

	@echo "---------------------------------------"
	@echo "Running App Info Check For Chaos Engine"
	@echo "---------------------------------------"
	@go test engine/appinfo_test.go -v -count=1

.PHONY: engine-state
engine-state:

	@echo "---------------------------------------"
	@echo "Running App Info Check For Chaos Engine"
	@echo "---------------------------------------"
	@go test engine/engine-state_test.go -v -count=1

.PHONY: experiment-404
experiment-404:

	@echo "----------------------------------------------"
	@echo "Running Experiment Name Check For Chaos Engine"
	@echo "----------------------------------------------"
	@go test engine/experiment-404_test.go -v -count=1

.PHONY: job-cleanup-policy
job-cleanup-policy:

	@echo "-------------------------------------------------"
	@echo "Running Job Cleanup Policy Check For Chaos Engine"
	@echo "-------------------------------------------------"
	@go test engine/job-cleanup-policy_test.go -v -count=1

.PHONY: service-account
service-account:

	@echo "----------------------------------------------"
	@echo "Running Service Account Check For Chaos Engine"
	@echo "----------------------------------------------"
	@go test engine/service-account_test.go -v -count=1

.PHONY: experiment-image
experiment-image:

	@echo "---------------------------------------------------"
	@echo "Running Experiment Image Check For Chaos Experiment"
	@echo "---------------------------------------------------"
	@go test engine/service-account_test.go -v -count=1

.PHONY: target-pod
target-pod:

	@echo "-----------------------------"
	@echo "Running Target pod chaos test"
	@echo "-----------------------------"
	@go test experiment/target-pod_test.go -v -count=1