<template>
    <!-- REPLACE WITH YOUR INPUT FILE TAG/COMPONENT -->
    <div>
      <div class="m-4">
        <input  type="file" @input="handleUpload" multiple drag-drop expanded>
          <section class="section">
            <div class="content has-text-centered">
              <p>
                aa
            </p>
              <p>Suelta tus archivos aquí o haz clic para subir</p>
            </div>
          </section>
        </input>
      </div>
  
      <div class="tags m-4">
        <span class="tag is-primary" v-for="(file, index) in dropFiles" :key="index">
          {{ file.name }}
          <button
            class="delete is-small"
            type="button"
            @click="deleteDropFile(index)"
          ></button>
        </span>
      </div>
    </div>
  </template>
  
<script>
import { ref } from 'vue'
import * as XLSX from 'xlsx'

export default {
  props: {
    beforeUpload: Function,
    onSuccess: Function,
  },
  setup(props) {
    const loading = ref(false)
    const dropFiles = ref([])
    const excelData = ref({
      file: null,
      header: null,
      results: null,
    })

    const generateData = ({ header, results }) => {
      excelData.value.file = dropFiles.value[dropFiles.value.length - 1]
      excelData.value.header = header
      excelData.value.results = results
      if (props.onSuccess) props.onSuccess(excelData.value)
    }

    const isExcel = (file) => /\.(xlsx|xls|csv)$/.test(file.name)

    const getHeaderRow = (sheet) => {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      const R = range.s.r
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        let hdr = 'UNKNOWN ' + C
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    }

    const readerData = (rawFile) => {
      loading.value = true
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          generateData({ header, results })
          loading.value = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    }

    const upload = (rawFile) => {
      if (!props.beforeUpload) {
        readerData(rawFile)
        return
      }
      const before = props.beforeUpload(rawFile)
      if (before) {
        readerData(rawFile)
      }
    }

    const handleUpload = () => {
      if (loading.value) return
      const files = dropFiles.value
      const rawFile = files[0] // only use files[0]
      if (!isExcel(rawFile)) {
        alert('Only supports upload .xlsx, .xls, .csv suffix files') // Replace with your notification system
        return false
      }
      upload(rawFile)
    }

    const deleteDropFile = (index) => {
      dropFiles.value.splice(index, 1)
    }

    return {
      loading,
      dropFiles,
      excelData,
      handleUpload,
      deleteDropFile,
      isExcel,
    }
  },
}
</script>