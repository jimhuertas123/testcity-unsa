export interface Component{
  file: string,
  name: string,
  startLine: number,
  endLine: number,
  totalLines: number,
  attributes: number,
  methods: number,
  testPercent: string,
  lineNotCovered: number[]
}
//treemap para directorios
  
interface SubDirectory{
  path: string;
  directory: string;
  components: Components[];
}

export interface Components{
  path: string;
  file: string;
  components: (Component | SubDirectory)[];
}